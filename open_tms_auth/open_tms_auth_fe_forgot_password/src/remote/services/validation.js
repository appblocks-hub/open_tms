import * as Yup from 'yup';

const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const forgotPassSchema = Yup.object().shape({
  email: Yup.string()
    .max(50)
    .required('Field required')
    .matches(emailRegex, 'Please enter a valid email'),
});

const validation = {
  forgotPassSchema,
};

export default validation;
