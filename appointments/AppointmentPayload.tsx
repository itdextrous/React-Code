import _ from 'lodash'
export const AppointmentPayload = (inputValues: any, nothing: any) => {
  const {
    status,
    id,
    start,
    end,
    comment,
    patientId,
    agendaCode,
    subAgendaCode,
    afspraakCode,
    consultType,
    encounterId,
  } = inputValues
  const participant =_.get(inputValues,['practitioners','value','value'],null)?.split('/')[1]
  const data = {
    resourceType: 'Appointment',
    status: status?.value ? status.value : 'booked',
    id: id.value,
    extension: [
      {
        url: 'http://fhir.medlix.org/StructureDefinition/appointment-schedule-id',
        valueString: encounterId?.value,
      },
    ],
    serviceCategory: [
      {
        coding: [
          {
            code: _.get(agendaCode, ['value', 0, 'value'], null),
            display: _.get(agendaCode, ['value', 1, 'value'], null),
          },
        ],
      },
    ],
    serviceType: [
      {
        coding: [
          {
            code: _.get(subAgendaCode, ['value', 0, 'value'], null),
            display: _.get(subAgendaCode, ['value', 1, 'value'], null),
          },
        ],
      },
    ],
    appointmentType: {
      coding: [
        {
          code: _.get(afspraakCode, ['value', 0, 'value'], null),
          display: _.get(afspraakCode, ['value', 1, 'value'], null),
        },
      ],
    },
    reasonCode: [
      {
        coding: [
          {
            code: _.get(consultType, ['value', 0, 'value'], null),
            display: _.get(consultType, ['value', 1, 'value'], null),
          },
        ],
      },
    ],
    start: `${start.value[0].value[0].value}T${start.value[0].value[1].value}:00`,
    end: `${end.value[0].value[0].value}T${end.value[0].value[1].value}:00`,
    comment: comment?.value ?? '',
    participant: [
      {
        actor: {
          reference: `Patient/${patientId?.value}`,
        },

        status: 'accepted',
      },
      {
        actor: {
          reference: `Practitioner/${participant}`,
        },
        status: 'accepted',
      },
    ],
  }
  return data
}
