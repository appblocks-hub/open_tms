/* eslint-disable no-param-reassign */
/* eslint-disable no-throw-literal */
import Validator from 'validator'
import { shared } from '@appblocks/node-sdk'

const { isEmpty } = await shared.getShared()

function validatIncomingRequestBody(data) {
  const errors = {}

  data.name = !isEmpty(data.name) ? data.name : ''
  data.department = !isEmpty(data.department) ? data.department : ''
  data.description = !isEmpty(data.description) ? data.description : ''
  data.ticket_type = !isEmpty(data.ticket_type) ? data.ticket_type : ''

  if (Validator.isEmpty(data.name)) {
    errors.first_name = 'ticket name field is required'
  }

  if (Validator.isEmpty(data.department)) {
    errors.last_name = 'department id is required'
  }

  if (Validator.isEmpty(data.description)) {
    errors.email = 'ticket description is required'
  }

  if (Validator.isEmpty(data.ticket_type)) {
    errors.password = 'ticket type is required'
  }

  if (!isEmpty(errors)) {
    throw { errorCode: 400, message: errors }
  }
}

export default validatIncomingRequestBody
