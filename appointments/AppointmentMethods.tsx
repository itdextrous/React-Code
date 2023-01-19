import { Appointment } from 'src/types'
import { deleteRequest, getRequest, postRequest } from 'src/utils/apiServices'
import _ from 'lodash'
type Entries = {
  resource: Appointment
}

const addEncounterOfAppointment = async (patientId: string|null, appointmentId: string) => {
  const data = {
    resourceType: 'Encounter',
    subject: { reference: 'Patient/' + patientId },
    status: 'planned',
    class: {
      system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
      code: 'AMB',
      display: 'ambulatory',
    },
    appointment: [
      {
        reference: `Appointment/${appointmentId}`,
      },
    ],
  }
  let url = `/fhir/Encounter?Appointment=${appointmentId}`
  return await postRequest(url, data)
}

/**
 * Method used to get the encounter Id or calender code of appointment while rendering .
 * @param {item} It will take the appointment data  .
 * @returns - This will return encounterId or calender code.
 */
const GetRecordValue = (item: any, index: string) => {
  if (Object.keys(item?.resource).includes('extension')) {
    if (Object.keys(item?.resource?.extension)?.includes(index)) {
      return item?.resource?.extension[index].valueString
    }
  }
  return null
}
/**
 * Method used to delete appointment data .
 * @param {selectedId} It will take selected appointment Id .
 * @returns - This will return the response if deleted or not.
 */
const DeleteAppointment = async (url: string) => {
  await deleteRequest(url)
}
/**
 * Method used to delete appointment data .
 * @param {selectedId} It will take selected appointment Id .
 * @returns - This will return the response if deleted or not.
 */
const NavigateTasks = (item: Appointment, history: any, patientId: string|null) => {
  history.push(`Task?encounter_id=${item.encounter_id}&patient=${patientId}`)
}

/**
 * Method used to get the appointment type of appointment while rendering .
 * @param {item} It will take the appointment data  .
 * @returns - This will return appointment type of appointment.
 */
const GetAppointmentType = (item: any) => {
  if (Object.keys(item?.resource).includes('appointmentType')) {
    if (Object.keys(item?.resource?.appointmentType).includes('coding')) {
      if (Object.keys(item?.resource?.appointmentType?.coding).includes('0')) {
        return item?.resource?.appointmentType?.coding[0]?.display
      }
    }
  }
}
/**
 * Method used to set fetch patients data .
 * @param {url} It will take url of fetching the data .
 * @returns - This will return the patient data
 */
const FetchRecords = async (url: string) => {
  const response = await getRequest(url)
  let appointmentList: Appointment[] = []
   appointmentList= mappedDataForAppointmentList(response)
  return {appointmentList,response:response.data}
}
/**
 * function to map the appointment data
 */
const mappedDataForAppointmentList =(response:any) =>{
	return response?.data?.entry?.map((item) => {
		return {
		  id: item?.resource.id,
		  start: item?.resource?.start,
		  service_type: getServiceType(item),
		  appointment_type: GetAppointmentType(item),
		  end: item?.resource?.end,
		  comment: item?.resource?.comment,
		  status: item?.resource?.status,
		  encounter_id: GetRecordValue(item, '0'),
		  calenderCode: GetRecordValue(item, '1'),
      appointmentTypeCode: _.get(item, ['resource', 'appointmentType', 'coding', 0, 'code'], null),
      serviceCategoryDisplay:  _.get(item, ['resource', 'serviceCategory', 0, 'coding', 0, 'display'], null),
      reasonCode:  _.get(item, ['resource', 'reasonCode', 0, 'coding', 0, 'code'], null),
      reasonDisplay:  _.get(item, ['resource', 'reasonCode', 0, 'coding', 0, 'display'], null),
		}
	  })
}
/**
 * Method used to get the service type of appointment while rendering .
 * @param {item} It will take the appointment data  .
 * @returns - This will return service type of appointment.
 */
const getServiceType = (item: any) => {
  if (Object.keys(item?.resource).includes('serviceType')) {
    if (Object.keys(item.resource.serviceType).includes('0')) {
      if (Object.keys(item.resource.serviceType[0]).includes('coding')) {
        if (Object.keys(item.resource.serviceType[0].coding).includes('0')) {
          return item.resource.serviceType[0].coding[0].display
        }
      }
    }
  }
}
/**
 * Method used to check if the pagination's link are coming in the response.
 * @param {response} It will take next link in the response of fhir .
 * @returns - This will return data of the appointment .
 */
const CheckPagination = (response?: any) => {}
/**
 * Method used to set add appointment data .
 * @param {Patient} It will take appointment data .
 * @returns - This will return the saved appointment data
 */
const AddAppointment = async (url: string, data: any) => {
  await postRequest(url, data)
    .then((response) => {
      addEncounterOfAppointment(response.data.id, response.data)
    })
    .catch((e) => {
      alert('this is something going wrong please try again!')
      // setVisible(false)
      console.log(e)
    })
}

const methods = {
  addEncounterOfAppointment,
  GetRecordValue,
  DeleteAppointment,
  NavigateTasks,
  GetAppointmentType,
  FetchRecords,
  CheckPagination,
  AddAppointment,
}
export default methods