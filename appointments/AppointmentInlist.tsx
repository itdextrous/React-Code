import { CTableRow, CTableHeaderCell, CTableDataCell, CButton } from '@coreui/react'
import DOMPurify from 'dompurify'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import methods from './AppointmentMethods'
import ReactTooltip from 'react-tooltip'
import moment from 'moment'
import { ItemType } from 'src/types/itemType'
import { getRequest } from 'src/utils/apiServices'
import { URL } from 'src/utils/enum'

export function AppointmentInList({ item, setDeleteId, patientId }) {
  const { t } = useTranslation()
  const history = useHistory()
/**
 *
 * @param id this is the appointment id use to reset the task related to appointment
 */
  const resetAppointment = async (id: string) => {
    await getRequest(`${URL.ResetAppointmentTask}${id}`).then(x => {
      alert('Task reset successfully.')
    }).catch(x => {
      console.log('Something went wrong.')
    })
  }

  return (
    <CTableRow key={item.id}>
      <CTableDataCell>
        <div data-tip={item.id} data-for={`tooltip:${item.id}`}>
          {' '}
          {item.id.slice(0, 8) + (item.id.length > 8 ? '...' : '')}
        </div>
        <ReactTooltip id={`tooltip:${item.id}`} effect="solid" />
      </CTableDataCell>
      <CTableDataCell
        dangerouslySetInnerHTML={{ __html: moment(item.start).format('YYYY-MM-DD <b>hh:mm</b>') }}
      />
      <CTableDataCell
        dangerouslySetInnerHTML={{ __html: moment(item.end).format('YYYY-MM-DD <b>hh:mm</b>') }}
      />

      <CTableDataCell
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(item.serviceCategoryDisplay),
        }}
      />

      <CTableDataCell
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(item.service_type),
        }}
      />

      <CTableDataCell>
        <div
          data-tip={item.appointment_type}
          data-for={`tooltip:${item.appointment_type}`}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(item.appointmentTypeCode),
          }}
        />
        <ReactTooltip id={`tooltip:${item.appointment_type}`} />
      </CTableDataCell>

      <CTableDataCell>
        <div
          data-tip={item.reasonDisplay}
          data-for={`tooltip:${item.reasonDisplay}`}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(item.reasonCode),
          }}
        />
        <ReactTooltip id={`tooltip:${item.reasonDisplay}`} />
      </CTableDataCell>

      <CTableDataCell>{item.status}</CTableDataCell>
      <CTableDataCell> <CButton
        color="info"
        variant="outline"
        className="m-2"
        style={{width: '111px'}}
        onClick={(e) => resetAppointment(item.id)}
      >
        {t('Reset Task')}
      </CButton></CTableDataCell>
      <CTableDataCell>
        <CButton
          color="info"
          variant="outline"
          className="m-2"
          onClick={() => methods.NavigateTasks(item, history, patientId)}
        >
          {t('Tasks')}

        </CButton>
        <CButton
          color="success"
          variant="outline"
          className="m-2"
          onClick={() =>
            history.push(
              `/admin/genericEdit?itemId=${item.id}&itemType=${ItemType.APPOINTMENT}&reference=${patientId}`,
            )
          }
        >
          {t('Edit')}
        </CButton>
        <CButton
          color="danger"
          variant="outline"
          onClick={() => {
            setDeleteId(item.id)
          }}
        >
          {t('Delete')}
        </CButton>
      </CTableDataCell>
    </CTableRow>
  )
}
