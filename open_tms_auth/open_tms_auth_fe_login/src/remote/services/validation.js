import * as Yup from 'yup';

const loginFormSchema = Yup.object().shape({
  email: Yup.string().required('Field required'),
  password: Yup.string().required('Field required'),
});

const validation = {
  loginFormSchema,
};

export default validation;
