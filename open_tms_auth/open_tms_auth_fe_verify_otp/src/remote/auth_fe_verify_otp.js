import React, { useEffect, useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import Button from './components/Button/Button'
import OtpField from './components/OtpField/OtpField'
import { useFormik } from 'formik'
import validation from './services/validation'
import helper from './services/helpers/index'
import auth from './services/auth'

export const open_tms_auth_fe_verify_otp = () => {
  const [loader, setLoader] = useState(false)
  const [otp, setOtp] = useState(false)
  const [apiError, setApiError] = useState('')
  const [countdownTime, setCountdownTime] = useState(120000)
  const [countDownText, setCountDownText] = useState('2:00')
  const navigate = useNavigate()

  const [searchParams] = useSearchParams()

  const formik = useFormik({
    initialValues: {
      otp: '',
      email: '',
    },
    onSubmit: (values) => {
      setLoader(true)
      auth
        .verifyOtp(values)
        .then((response) => {
          setApiError('')
          setLoader(false)
          helper.setLocalStorage('ACCESS_TOKEN', response.data.data.token)
          helper.setLocalStorage('REFRESH_TOKEN', response.data.data.refreshToken)
          navigate('/')
        })
        .catch((error) => {
          setApiError('Invalid OTP. Please try again or generate new otp')
          formik.setTouched({})
          setLoader(false)
        })
    },
    validationSchema: validation.verifyOtpSchema,
  })

  useEffect(() => {
    if (
      helper.checkValidUser() &&
      helper.getUserDetails().type === 4 &&
      helper.getUserDetails().status === 1 &&
      !helper.getUserDetails().isVerified
    ) {
      formik.setFieldValue('email', helper.getUserDetails().email)
    }
  }, [])

  useEffect(() => {
    formik.setFieldValue('otp', otp)
  }, [otp])

  useEffect(() => {
    if (searchParams.get('email')) {
      formik.setFieldValue('email', searchParams.get('email'))
    }
  }, [searchParams.get('email')])

  useEffect(() => {
    if (countdownTime != 0) {
      let timeLeft = countdownTime
      const countdownInterval = setInterval(() => {
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
    auth
      .resendEmailOtp({ email: formik.values.email })
      .then((response) => {
        setLoader(false)
        setCountdownTime(120000)
      })
      .catch((error) => {
        formik.setTouched({})
        setLoader(false)
      })
  }

  return (
    <div className="flex flex-col">
      <h2 className="text-3xl font-bold mb-2">Email Verification</h2>
      <p className="leading-[19px] mb-3">
        We have sent you an email containing One time password to “{formik.values.email}”. Enter the code below to
        confirm your email address
      </p>
      <form>
        <div className="mb-11 otp-field-input relative">
          <OtpField numInputs={6} onChange={setOtp} value={otp} error={apiError} />
          {apiError ? (
            <div className="absolute text-error text-left text-sm first-letter:uppercase bg-white py-1 leading-[17px]">
              {apiError}
            </div>
          ) : null}
        </div>
        <div className="mb-3">
          <Button
            type="button"
            name="Verify Code"
            btnType="primary"
            disabled={loader}
            handleButton={formik.handleSubmit}
            disableOnValidate={formik.errors.otp}
            isLoading={loader}
          />
        </div>
        <div className="mb-[72px] w-full">
          <div className="flex justify-center mb-2">
            <span className="">
              Didn’t receive an OTP?
              <button
                onClick={resendOtp}
                disabled={!!countDownText}
                type="button"
                className="text-success ml-2 disabled:text-gray-variant-4 disabled:cursor-not-allowed"
              >
                Resend OTP
              </button>
            </span>
          </div>
          {countDownText ? (
            <div className="flex justify-center">
              <span className="text-sm text-[#1A1A1A]">{countDownText} minutes</span>
            </div>
          ) : null}
        </div>
        <div className="flex justify-center absolute bottom-0 right-0 w-full bg-white pb-6 pt-3">
          <span className="">
            Already have an account.
            <Link
              to="/login"
              onClick={() => {
                helper.removeLocalStorage('AUTH_DETAILS')
                helper.removeLocalStorage('REFRESH_TOKEN')
                navigate('login')
              }}
              className="text-success font-semibold hover:opacity-80"
            >
              {' '}
              Sign In
            </Link>
          </span>
        </div>
      </form>
    </div>
  )
}
export default open_tms_auth_fe_verify_otp
