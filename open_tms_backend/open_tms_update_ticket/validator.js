/* eslint-disable no-param-reassign */
/* eslint-disable no-throw-literal */
import Validator from 'validator'
import { shared } from '@appblocks/node-sdk'

const { isEmpty } = await shared.getShared()

function validatIncomingRequestBody(data) {
  const errors = {}

  data.ticket_id = !isEmpty(data.ticket_id) ? data.ticket_id : ''
  data.to_stage = !isEmpty(data.to_stage) ? data.to_stage : ''
  data.assignee_id = !isEmpty(data.assignee_id) ? data.assignee_id : ''

  if (Validator.isEmpty(data.ticket_id)) {
    errors.first_name = 'ticket id is required'
  }

  if (Validator.isEmpty(data.to_stage)) {
    errors.last_name = 'stage id to be updated is required'
  }

  if (Validator.isEmpty(data.assignee_id)) {
    errors.email = 'ticket assignee id to be updated is required'
  }

  if (!isEmpty(errors)) {
    throw { errorCode: 400, message: errors }
  }
}

export default validatIncomingRequestBody
