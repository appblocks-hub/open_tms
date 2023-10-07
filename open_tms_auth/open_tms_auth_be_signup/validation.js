import Validator from 'validator'
import { shared } from '@appblocks/node-sdk'

// const { Validator } = pkg
const { isEmpty } = await shared.getShared()

function validateSignupInput(data) {
  let errors = {}

  data.email = !isEmpty(data.email) ? data.email : ''
  data.password = !isEmpty(data.password) ? data.password : ''
  data.first_name = !isEmpty(data.first_name) ? data.first_name : ''
  data.last_name = !isEmpty(data.last_name) ? data.last_name : ''

  if (Validator.isEmpty(data.first_name)) {
    errors.first_name = 'First name field is required'
  }

  if (Validator.isEmpty(data.first_name)) {
    errors.last_name = 'Last name field is required'
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid'
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required'
  }
  if (!Validator.isLength(data.password, { min: 8, max: 30 })) {
    errors.password = 'Password must be atleast 8 characters'
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required'
  }

  if (!isEmpty(errors)) {
    throw { errorCode: 400, message: errors }
  }
}

export default validateSignupInput
