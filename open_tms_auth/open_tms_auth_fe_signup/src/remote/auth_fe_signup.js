import React, { useState } from 'react'
import { useFormik } from 'formik'
import validation from './services/validation'
import auth from './services/apis/auth'
import { useNavigate, Link } from 'react-router-dom'
import ClosedEye from './closedeye'
import OpenEye from './openeye'
import classnames from 'classnames'

export const Signup = () => {
  const [loader, setLoader] = useState(false)
  const [apiError, setApiError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
    },
    onSubmit: (values, { setTouched }) => {
      setTouched(
        Object.keys(values).reduce((acc, field) => {
          acc[field] = true
          return acc
        }, {})
      )
      setLoader(true)
      const valuesForm = {
        ...values,
        email: values.email.toLowerCase(),
      }
      auth
        .register(valuesForm)
        .then((response) => {
          setApiError('')
          setLoader(false)
          navigate('/verify_otp' + `?email=${valuesForm.email}`)
        })
        .catch((error) => {
          setApiError(error?.response?.data?.message)
          formik.setErrors({})
          formik.setTouched({})
          setLoader(false)
        })
    },
    validationSchema: validation?.signupFormSchema,
  })

  return (
    <div className=" w-full float-left flex sm:block bg-white sm:mt-16">
      <div className="w-full flex flex-col items-center sm:justify-center pt-16 sm:p-2 main-wraper">
        <div className="w-full sm:max-w-[500px] bg-white sm:border sm:border-mid-gray sm:rounded-sm sm:min-h-0 p-8 sm:p-16 sm:shadow-lg min-h-screen">
          <div className="text-lg text-light-black font-bold mb-6">Sign up for Appblocks</div>
          <div>
            <form className="w-full mb-0" onSubmit={formik.handleSubmit}>
              <div className="mb-6">
                <label className="text-black font-almost-bold text-sm">First Name*</label>
                <input
                  autoFocus
                  id="first_name"
                  name="first_name"
                  type="text"
                  placeholder="Enter First Name"
                  label="First Name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.first_name}
                  error={formik.errors.first_name}
                  touched={formik.touched.first_name}
                  autoComplete="off"
                  className={classnames(
                    'w-full mt-2.5 px-4 py-3 bg-light-gray border focus:outline-none rounded-sm text-sm font-almost-bold text-light-black',
                    {
                      'border-light-gray': formik.errors.first_name && !formik.touched.first_name,
                      'focus:border-primary': formik.errors.first_name && !formik.touched.first_name,
                    },
                    {
                      'border-light-gray': !formik.errors.first_name && formik.touched.first_name,
                      'focus:border-primary': !formik.errors.first_name && formik.touched.first_name,
                    },
                    {
                      'border-error': formik.errors.first_name && formik.touched.first_name,
                      'focus:border-error': formik.errors.first_name && formik.touched.first_name,
                    }
                  )}
                />
              </div>
              <div className="mb-6">
                <label className="text-black font-almost-bold text-sm">Last Name*</label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  placeholder="Enter Last Name"
                  label="Last Name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.last_name}
                  error={formik.errors.last_name}
                  touched={formik.touched.last_name}
                  autoComplete="off"
                  className={classnames(
                    'w-full mt-2.5 px-4 py-3 bg-light-gray border focus:outline-none rounded-sm text-sm font-almost-bold text-light-black',
                    {
                      'border-light-gray': formik.errors.last_name && !formik.touched.last_name,
                      'focus:border-primary': formik.errors.last_name && !formik.touched.last_name,
                    },
                    {
                      'border-light-gray': !formik.errors.last_name && formik.touched.last_name,
                      'focus:border-primary': !formik.errors.last_name && formik.touched.last_name,
                    },
                    {
                      'border-error': formik.errors.last_name && formik.touched.last_name,
                      'focus:border-error': formik.errors.last_name && formik.touched.last_name,
                    }
                  )}
                />
              </div>
              <div className="mb-6">
                <label htmlFor="email" className="text-black font-almost-bold text-sm">
                  Email*
                </label>
                <div className="w-full relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter Email"
                    label="Email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    error={formik.errors.email}
                    touched={formik.touched.email}
                    autoComplete="off"
                    className={classnames(
                      'w-full mt-2.5 px-4 py-3 bg-light-gray border focus:outline-none rounded-sm text-sm font-almost-bold text-light-black',
                      {
                        'border-light-gray': formik.errors.email && !formik.touched.email,
                        'focus:border-primary': formik.errors.email && !formik.touched.email,
                      },
                      {
                        'border-light-gray': !formik.errors.email && formik.touched.email,
                        'focus:border-primary': !formik.errors.email && formik.touched.email,
                      },
                      {
                        'border-error': formik.errors.email && formik.touched.email,
                        'focus:border-error': formik.errors.email && formik.touched.email,
                      }
                    )}
                  />
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="password" className="text-black font-almost-bold text-sm">
                  Password*
                </label>
                <div className="w-full relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter password"
                    label="Password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    error={formik.errors.password}
                    touched={formik.touched.password}
                    autoComplete="off"
                    className={classnames(
                      'w-full mt-2.5 px-4 py-3 bg-light-gray border focus:outline-none rounded-sm text-sm font-almost-bold text-light-black',
                      {
                        'border-light-gray': formik.errors.password && !formik.touched.password,
                        'focus:border-primary': formik.errors.password && !formik.touched.password,
                      },
                      {
                        'border-light-gray': !formik.errors.password && formik.touched.password,
                        'focus:border-primary': !formik.errors.password && formik.touched.password,
                      },
                      {
                        'border-error': formik.errors.password && formik.touched.password,
                        'focus:border-error': formik.errors.password && formik.touched.password,
                      }
                    )}
                  />
                  <div
                    className={`absolute w-8 h-full right-1 cursor-pointer ${showPassword ? 'top-7' : 'top-8'}`}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <OpenEye /> : <ClosedEye />}
                  </div>
                  <input
                    autoComplete="on"
                    style={{ display: 'none' }}
                    id="fake-hidden-input-to-stop-google-address-lookup"
                  ></input>

                  <div className="flex flex-col pb-6 text-[#3D3D3D] text-[10px] leading-6 relative">
                    <span>Password must be at least 8 characters long.</span>
                    <span>Password must contain at least one upper case.</span>
                    <span>One lower case letter.</span>
                    <span>Password must contain at least one number and special character</span>
                    {apiError ? (
                      <div className="absolute bottom-0 left-0 text-error text-left text-sm first-letter:uppercase bg-white py-1 leading-[17px]">
                        {apiError}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="flex flex-col button-wrapper w-full mt-6">
                <button
                  className="w-full rounded-sm py-3 focus:outline-none mb-6 font-heavy text-white text-md  bg-primary disabled:bg-gray transition-all"
                  type="submit"
                  name="Register"
                  btnType="primary"
                  disabled={formik.isSubmitting}
                  isLoading={loader}
                >
                  Sign Up
                </button>
                <p className="w-full text-sm mb-6 text-grey">
                  Already have an account?
                  <Link
                    to={'/login'}
                    className="text-primary cursor-pointer hover:underline underline-offset-4 font-bold focus:outline-none"
                  >
                    &nbsp;Sign in
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
export default Signup
