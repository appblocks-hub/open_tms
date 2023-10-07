import * as Yup from 'yup';

const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
const nameRegex = /^[\p{L} ]+$/u;

const signupFormSchema = Yup.object().shape({
  first_name: Yup.string()
    .required('Field required')
    .max(50, 'Too long. Max 50 characters')
    .matches(nameRegex, 'Please enter a valid first name')
    .test(
      'is-space-only',
      'Please enter a valid first name',
      (value) => value?.trim()?.length > 0
    ),
  last_name: Yup.string()
    .required('Field required')
    .max(50, 'Too long. Max 50 characters')
    .matches(nameRegex, 'Please enter a valid last name')
    .test(
      'is-space-only',
      'Please enter a valid last name',
      (value) => value?.trim()?.length > 0
    ),
  email: Yup.string()
    .max(50)
    .required('Field required')
    .matches(emailRegex, 'Please enter a valid email'),
  password: Yup.string()
    .min(8, 'Does not meet the requirements')
    .max(30, 'Does not meet the requirements')
    .required('Field required')
    .matches(passRegex, 'Does not meet the requirements'),
});

const validation = {
  signupFormSchema,
};

export default validation;
