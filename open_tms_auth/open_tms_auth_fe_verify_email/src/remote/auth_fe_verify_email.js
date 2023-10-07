import React, { useEffect, useState } from 'react'
import Button from './common/Button/Button'
import OtpField from './common/OtpField/OtpField'
import { useFormik } from 'formik'
import validation from './services/validation'
import auth from './services/apis/auth'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'

export const VerifyEmail = () => {
  const [emailLoader, setEmailLoader] = useState(false)
  const [otp, setOtp] = useState(false)
  const [email, setEmail] = useState('')
  const [apiError, setApiError] = useState('')
  const [countdownTime, setCountdownTime] = useState(120000)
  const [countDownText, setCountDownText] = useState('2:00')
  const navigate = useNavigate()

  const [searchParams] = useSearchParams()

  const formik = useFormik({
    initialValues: {
      email: '',
      otp: '',
    },
    onSubmit: (values) => {
      setEmailLoader(true)
      auth
        .verifyOtp(values)
        .then((response) => {
          setApiError('')
          setEmailLoader(false)
          navigate(
            `/reset_password?userAuthToken=${response?.data?.data?.user_auth_token}`
          )
        })
        .catch((error) => {
          setApiError(error?.response?.data?.message)
          setTimeout(() => setApiError(''), 5000)
          formik.setTouched({})
          setEmailLoader(false)
        })
    },
    validationSchema: validation.verifyOtpSchema,
  })

  useEffect(() => {
    setEmailLoader(true)
    auth
      .sendOtpForVerification({ email: searchParams.get('email') })
      .then((response) => {
        setEmail(response?.data?.data?.email)
        setEmailLoader(false)
      })
      .catch((error) => {
        console.log(error)
        setEmailLoader(false)
      })
  }, [])

  useEffect(() => {
    formik.setFieldValue('otp', otp)
  }, [otp])

  useEffect(() => {
    formik.setFieldValue('email', searchParams.get('email'))
  }, [searchParams.get('email')])

  useEffect(() => {
    if (countdownTime != 0) {
      let timeLeft = countdownTime
      let countdownInterval = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60000)
        const seconds = Math.floor((timeLeft % 60000) / 1000)
        setCountDownText(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`)
        timeLeft -= 1000
        if (timeLeft < 0) {
          clearInterval(countdownInterval)
          setCountDownText(null)
        }
      }, 1000)
    }
  }, [countdownTime])

  const resendOtp = () => {
    setCountDownText('2:00')
    setCountdownTime(0)
    auth.sendOtpForVerification({ email: searchParams.get('email') })
  }

  return (
    <div className='default w-full float-left flex sm:block bg-white sm:mt-16'>
      <div className='w-full flex flex-col items-center sm:justify-center pt-16 sm:p-2 main-wraper'>
        <div className='w-full sm:max-w-[500px] bg-white sm:border sm:border-mid-gray sm:rounded-sm sm:min-h-0 p-8 sm:p-12 sm:shadow-lg min-h-screen'>
          <div className='flex flex-col'>
            <h2 className='text-3xl font-bold mb-8'>OTP Verification</h2>
            {/* <p className="leading-[19px] mb-10">
              Don’t worry, this happens to the best of us!
            </p> */}
            {email && (
              <p className='leading-[19px] mb-3'>
                We have sent you an email containing One time password to{' '}
                <span className='font-semibold'>{email}</span>
              </p>
            )}
            <form>
              <div className='mb-11 otp-field-input relative'>
                <OtpField
                  numInputs={6}
                  onChange={setOtp}
                  value={otp}
                  error={apiError}
                />
                {apiError ? (
                  <div className='absolute text-error text-left text-sm first-letter:uppercase bg-white py-1 leading-[17px]'>
                    {apiError}
                  </div>
                ) : null}
              </div>
              <div className='mb-2'>
                <Button
                  type='button'
                  name='Verify Code'
                  btnType='primary'
                  disabled={emailLoader}
                  disableOnValidate={formik.errors.otp}
                  handleButton={formik.handleSubmit}
                  isLoading={emailLoader}
                />
              </div>
              <div className='w-full'>
                <div className='flex justify-center mb-2'>
                  <span className=''>
                    Didn’t receive an OTP?
                    <button
                      onClick={resendOtp}
                      disabled={!!countDownText}
                      type='button'
                      className='text-success ml-2 disabled:text-gray-variant-4 disabled:cursor-not-allowed'>
                      Resend OTP
                    </button>
                  </span>
                </div>
                {countDownText ? (
                  <div className='flex justify-center'>
                    <span className='text-sm text-[#1A1A1A]'>
                      {countDownText} minutes
                    </span>
                  </div>
                ) : null}
              </div>
              <div className='flex justify-center absolute bottom-0 right-0 w-full bg-white pb-6 pt-3'>
                <span className=''>
                  Already have an account.
                  <Link to='/login' className='text-success font-semibold'>
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
export default VerifyEmail
