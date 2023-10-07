import * as Yup from 'yup';

const passRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;

const resetPassSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Does not meet the requirements')
    .max(30, 'Does not meet the requirements')
    .required('Field required')
    .matches(passRegex, 'Does not meet the requirements'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], "Password doesn't match")
    .required('Required'),
});

const validation = {
  resetPassSchema,
};

export default validation;
