/* eslint-disable max-len */
import React, { lazy } from 'react'
import { Route, Routes, Outlet, Link } from 'react-router-dom'
import { PublicRoute } from './PublicRoute'
import url_constants from './url_constants'

const {
  LOGIN,
  RESET_PASSWORD,
  VERIFY_EMAIL,
  FORGOT_PASSWORD,
  SIGNUP,
  VERIFY_OTP,
} = url_constants

const RouterMain = () => {
  const Login = lazy(() => import('../federated_components/login/login'))
  const ForgotPassword = lazy(() =>
    import('../federated_components/forgot-password/forgot-password')
  )
  const VerifyOtp = lazy(() =>
    import('../federated_components/verify-otp/verify-otp')
  )
  const ResetPassword = lazy(() =>
    import('../federated_components/reset-password/reset-password')
  )
  const Signup = lazy(() => import('../federated_components/signup/signup'))
  const VerifyOtpEmail = lazy(() =>
    import('../federated_components/verify-email/verify-email')
  )

  return (
    <>
      <Routes>
        <Route
          path='/'
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path={LOGIN}
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          exact
          path={FORGOT_PASSWORD}
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path={VERIFY_OTP}
          element={
            <PublicRoute>
              <VerifyOtp />
            </PublicRoute>
          }
        />
        <Route
          exact
          path={RESET_PASSWORD}
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />
        <Route
          exact
          path={SIGNUP}
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path={VERIFY_EMAIL}
          element={
            <PublicRoute>
              <VerifyOtpEmail />
            </PublicRoute>
          }
        />
      </Routes>
    </>
  )
}

export default RouterMain
