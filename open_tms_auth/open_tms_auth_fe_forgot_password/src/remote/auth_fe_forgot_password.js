import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
// import Button from "./federated_components/Button/Button";
// import InputBox from "./federated_components/InputBox/InputBox";
import validation from './services/validation'
import auth from './services/apis/auth'
import { useNavigate, Link } from 'react-router-dom'
import InputBox from './common/InputBox/InputBox'
import Button from './common/Button/Button'

export const ForgotPassword = () => {
  const [apiError, setApiError] = useState('')
  const [loader, setLoader] = useState(false)
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    onSubmit: (values) => {
      const valuesForm = {
        email: values.email.toLowerCase(),
      }
      setLoader(true)
      auth
        .forgotPass(valuesForm)
        .then((response) => {
          setApiError('')
          setLoader(false)
          navigate('/verify_email' + `?email=${valuesForm.email}`)
        })
        .catch((error) => {
          setApiError(error?.response?.data?.message)
          setTimeout(() => setApiError(''), 5000)
          setLoader(false)
        })
    },
    validationSchema: validation.forgotPassSchema,
  })

  useEffect(() => {
    if (formik.values.email === '') {
      formik.setFieldError('email', 'Field required')
    }
  }, [formik.errors])

  return (
    <div className='default w-full float-left flex sm:block bg-white sm:mt-16'>
      <div className='w-full flex flex-col items-center sm:justify-center pt-16 sm:p-2 main-wraper'>
        <div className='w-full sm:max-w-[420px] bg-white sm:border sm:border-mid-gray sm:rounded-sm sm:min-h-0 p-8 sm:p-16 sm:shadow-lg min-h-screen'>
          <div className='flex flex-col'>
            <h2 className='text-3xl font-bold mb-2'>Forgot Password?</h2>
            <p className='leading-[19px] mb-6'>
              Don’t worry, this happens to the best of us!
            </p>
            <form>
              <div className='mb-7 relative'>
                <InputBox
                  autoFocus
                  id='email'
                  name='email'
                  type='text'
                  placeholder='Enter email ID'
                  label='Please enter your registered email'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  error={formik.errors.email}
                  touched={formik.touched.email}
                />
                {apiError ? (
                  <div className='absolute text-error text-left text-sm first-letter:uppercase bg-white py-1 leading-[17px]'>
                    {apiError}
                  </div>
                ) : null}
              </div>
              <div className='mb-[72px]'>
                <Button
                  className='flex justify-center items-center w-full rounded-sm py-3 focus:outline-none mb-6 font-heavy text-white text-md  bg-primary disabled:bg-gray transition-all'
                  type='button'
                  name='Request OTP'
                  btnType='primary'
                  disabled={loader}
                  handleButton={formik.handleSubmit}
                  disableOnValidate={formik.errors.email}
                  isLoading={loader}
                />
              </div>
              <div className='flex justify-center absolute bottom-0 right-0 w-full bg-white pb-6 pt-3'>
                <span className=''>
                  Already have an account.
                  <Link to='/login' className='text-success font-semibold'>
                    {' '}
                    Sign In
                  </Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ForgotPassword
