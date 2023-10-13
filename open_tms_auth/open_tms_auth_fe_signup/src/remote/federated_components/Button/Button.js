import React from 'react'
import { useFederatedComponent } from '@appblocks/js-sdk'

const Button = (props) => {
  const { Component: Button, errorLoadingButton } = useFederatedComponent(
    process.env.BB_OPEN_TMS_ELEMENTS_URL,
    'remotes',
    './button_container',
    React
  )
  return (
    <React.Suspense fallback={''}>
      {errorLoadingButton ? `Error loading module "${module}"` : Button && <Button {...props} />}
    </React.Suspense>
  )
}

export default Button
