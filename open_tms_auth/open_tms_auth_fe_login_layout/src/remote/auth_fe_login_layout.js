import React from 'react'

const LoginLayout = ({ children }) => {
  return (
    <div className='flex'>
      <div className='min-h-screen w-screen bg-white flex justify-center items-center overflow-auto relative top-0'>
        <div className='w-[600px] py-4'>{children}</div>
      </div>
    </div>
  )
}

export default LoginLayout
