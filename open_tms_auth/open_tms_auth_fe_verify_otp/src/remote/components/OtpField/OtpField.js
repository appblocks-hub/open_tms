import React from 'react';
import OtpInput from 'react-otp-input';

const OtpField = ({ value, onChange, numInputs, error }) => {
  return (
    <>
      {error}
      <OtpInput
        value={value}
        onChange={onChange}
        numInputs={numInputs}
        isInputNum={true}
        renderInput={(props, index) => (
          <input autoFocus={index == 0} {...props} />
        )}
        inputStyle={{
          width: '16.66%',
          height: '50px',
          margin: '0',
          fontSize: '16px',
          fontWeight: '600',
          lineHeight: '22px',
          borderRadius: '5px',
          border: `1px solid ${error ? '#EB5757' : '#E8E8E8'}`,
          background: '#FFFFFF',
          color: '#010101',
        }}
        focusStyle={{
          outline: 'none',
          boxShadow: 'unset',
        }}
      />
    </>
  );
};

export default OtpField;
