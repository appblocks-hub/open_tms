import React, { useState } from 'react'
import { useFormik } from 'formik'
import validation from './services/validation'
import helper from './services/helpers/index'
import auth from './services/apis/auth'
import { useNavigate, Link } from 'react-router-dom'
import classnames from 'classnames'
import InputBox from './common/InputBox/InputBox'
import Button from './common/Button/Button'

const Login = () => {
  const navigate = useNavigate()

  const [loader, setLoader] = useState(false)
  const [apiError, setApiError] = useState('')

  const loginSubmit = (values) => {
    const valuesForm = {
      email: values.email.toLowerCase(),
      password: values.password,
    }
    auth
      .login(valuesForm)
      .then((response) => {
        setApiError('')
        helper.setLocalStorage('ACCESS_TOKEN', response.data.data.token)
        helper.setLocalStorage('REFRESH_TOKEN', response.data.data.refreshToken)
        setLoader(false)
        navigate('')
        window.open('http://localhost:3000')
      })
      .catch((err) => {
        if (err.response?.status === 403)
          navigate('/verify_email' + `?email=${valuesForm.email}`)
        setApiError(err?.response?.data?.message)
        formik.setErrors({})
        formik.setTouched({})
        setLoader(false)
      })
  }

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: (values) => {
      setLoader(true)
      loginSubmit(values)
    },
    validationSchema: validation?.loginFormSchema,
  })

  return (
    <div className='default w-full float-left flex sm:block bg-white sm:mt-16'>
      <div className='w-full flex flex-col items-center sm:justify-center pt-16 sm:p-2 main-wraper'>
        <div className='w-full sm:max-w-[420px] bg-white sm:border sm:border-mid-gray sm:rounded-sm sm:min-h-0 p-8 sm:p-16 sm:shadow-lg min-h-screen'>
          <div className='text-lg text-light-black font-bold mb-6'>
            Login for Appblocks
          </div>
          <div>
            <form className='w-full mb-0' onSubmit={formik.handleSubmit}>
              <div>
                <div className='mb-2'>
                  <InputBox
                    autoFocus
                    type='text'
                    id='email'
                    name='email'
                    placeholder='Enter email ID'
                    label='Email*'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    error={formik.errors.email}
                    touched={formik.touched.email?.toString()}
                    className={classnames(
                      'w-full mt-2.5 px-4 py-3 bg-light-gray border focus:outline-none rounded-sm text-sm font-almost-bold text-light-black',
                      {
                        'border-light-gray':
                          !formik.errors.email && !formik.touched.email,
                        'focus:border-primary':
                          !formik.errors.email && !formik.touched.email,
                      },
                      {
                        'border-error':
                          formik.errors.email && formik.touched.email,
                        'focus:border-error':
                          formik.errors.email && formik.touched.email,
                      }
                    )}
                  />
                </div>
                <div>
                  <InputBox
                    id='password'
                    name='password'
                    type={'password'}
                    placeholder='Enter password'
                    label='Password*'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    error={formik.errors.password}
                    touched={formik.touched.password?.toString()}
                    className={classnames(
                      'w-full mt-2.5 px-4 py-3 bg-light-gray border focus:outline-none rounded-sm text-sm font-almost-bold text-light-black',
                      {
                        'border-light-gray':
                          !formik.errors.password && !formik.touched.password,
                        'focus:border-primary':
                          !formik.errors.password && !formik.touched.password,
                      },
                      {
                        'border-error':
                          formik.errors.password && formik.touched.password,
                        'focus:border-error':
                          formik.errors.password && formik.touched.password,
                      }
                    )}
                  />
                </div>
                {apiError ? (
                  <div className='text-error text-left text-sm first-letter:uppercase bg-white pb-4 leading-[17px]'>
                    {apiError}
                  </div>
                ) : null}
              </div>
              <div>
                <p className='text-light-black text-sm text-grey mt-4 mb-6'>
                  Forgot Password?{' '}
                  <Link
                    to={'/forgot_password'}
                    className='text-primary text-sm font-bold cursor-pointer hover:underline underline-offset-4 focus:outline-none'>
                    Reset
                  </Link>
                </p>
                <Button
                  type='submit'
                  name='Login'
                  btnType='primary'
                  className='flex justify-center items-center w-full rounded-sm py-3 focus:outline-none mb-6 font-heavy text-white text-md  bg-primary disabled:bg-gray transition-all'
                  disabled={
                    !(formik.values.email && formik.values.password) || loader
                  }
                  isLoading={loader}
                />
                <p className=' text-light-black text-sm mb-6 '>
                  New to appblocks?{' '}
                  <Link
                    to={'/signup'}
                    className='text-primary text-sm font-bold cursor-pointer hover:underline underline-offset-4 focus:outline-none'>
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Login
