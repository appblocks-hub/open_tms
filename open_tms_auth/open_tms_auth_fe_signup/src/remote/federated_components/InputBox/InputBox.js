import React from 'react'
import { useFederatedComponent } from '@appblocks/js-sdk'

const InputBox = (props) => {
  const { Component: InputBox, errorLoadingInputBox } = useFederatedComponent(
    process.env.BB_AUTH_ELEMENTS_URL,
    'remotes',
    './input_box',
    React
  )
  return (
    <React.Suspense fallback={''}>
      {errorLoadingInputBox
        ? `Error loading module "${module}"`
        : InputBox && <InputBox {...props} />}
    </React.Suspense>
  )
}

export default InputBox
