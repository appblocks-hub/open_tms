import React from 'react'
import { useFederatedComponent } from '@appblocks/js-sdk'

const Login = (props) => {
  const system = {
    url: process.env.BB_OPEN_TMS_ELEMENTS_URL,
    scope: 'remotes',
    module: './open_tms_auth_fe_login',
  }
  const { Component: FederatedComponent, errorLoading } = useFederatedComponent(
    system?.url,
    system?.scope,
    system?.module,
    React
  )

  return (
    <>
      <React.Suspense fallback={''}>
        {errorLoading ? `Error loading module "${module}"` : FederatedComponent && <FederatedComponent {...props} />}
      </React.Suspense>
    </>
  )
}

export default Login
