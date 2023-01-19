import React, { useEffect, useState, useMemo } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton } from '@coreui/react'
import { useHistory, useLocation } from 'react-router-dom'
import { Container } from '@material-ui/core'
import { Appointment } from 'src/types'
import { useTranslation } from 'react-i18next'
import { URL } from '../../utils/enum'
import methods from './AppointmentMethods'
import pagination from '../../utils/paginationService'
import ModalDelete from 'src/components/Modal/ModalDelete'
import { AppointmentInList } from './AppointmentInlist'
import { URL as urls } from '../../utils/enum'
import Table from 'src/common/Table'
import { ItemType } from 'src/types/itemType'

const Appointments = () => {
  const { t } = useTranslation()
  const [appointmentsList, setAppointmentsList] = useState<Appointment[]>([])
  const [requesting, setRequesting] = useState<boolean>(false)
  const [urlPagination, setUrlPagination] = useState<any>(null)
  const [deleteId, setDeleteId] = useState<string>('')
  const search = useLocation().search
  let patientId = new URLSearchParams(search).get('patient_id')
    ? new URLSearchParams(search).get('patient_id')
    : new URLSearchParams(search).get('patient')

  const history = useHistory()
  useEffect(() => {
    fetchRecords()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * Method used to set fetch appointment data .
   * @param {url} It will take url of fetching the data .
   * @returns - This will return the appointment data
   */
  const fetchRecords = async (url = null) => {
    setRequesting(true)
    const data = await methods.FetchRecords(
      url ? url : `${URL.GetPatientAppointment}/${patientId}&_sort=-_lastUpdated`,
    )
    checkPagination(data.response)
    setAppointmentsList(data.appointmentList)
    setRequesting(false)
  }

  const loadMore = async () => {
    if (!urlPagination) return
    setRequesting(true)
    const data = await methods.FetchRecords(urlPagination)
    checkPagination(data.response)
    setAppointmentsList([...appointmentsList, ...data.appointmentList])
    setRequesting(false)
  }

  const columnsAppointment = [
    t('ID'),
    t('Start'),
    t('End'),
    t('Agenda'),
    t('Sub Agenda'),
    t('Afspraakcode'),
    t('Consult Type'),
    t('Status'),
    t('Reset Task'),
    t('Actions'),
  ]

  const checkPagination = (response?: any) => {
    if (response.link) setUrlPagination(pagination.checkPaginationUrls(response))
  }

  const AppointmentMemo = useMemo(() => {
    return appointmentsList?.map((item: any) => {
      return (
        <AppointmentInList
          key={item.id}
          item={item}
          setDeleteId={setDeleteId}
          patientId={patientId}
        />
      )
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentsList])

  return (
    <Container>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4 border-0">
            <CCardHeader className="card-header d-md-flex align-items-center justify-content-between bg-transparent border-0 p-0 mb-4 search_button header_font">
              <h2 className="patient_heading mb-md-0">
                {t('Appointments')} <span>{t('listing')}</span>
              </h2>
              <CButton
                style={{ float: 'right' }}
                onClick={() =>
                  history.push(
                    `/admin/genericEdit?itemId=new&itemType=${ItemType.APPOINTMENT}&reference=${patientId}`,
                  )
                }
              >
                {t('Add appointment')}
              </CButton>
            </CCardHeader>
            <div className="audit_eventTable">
              <CCardBody className="adminChatTable custom-table table-responsive appointmentTable">
                <Table
                  columns={columnsAppointment}
                  rows={AppointmentMemo}
                  caption={t('List of Appointments')}
                  loading={requesting}
                  urlPagination={urlPagination}
                  loadMore={loadMore}
                />
              </CCardBody>
            </div>
          </CCard>
        </CCol>

        {/* Delete practitioner model starts from here */}
        <ModalDelete
          deleteId={deleteId}
          setDeleteId={setDeleteId}
          fetchRecords={fetchRecords}
          url={urls.Appointment}
        />
        {/* Delete practitioner model closed here */}
      </CRow>
    </Container>
  )
}

export default Appointments
