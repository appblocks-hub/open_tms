import React, { useEffect, useState } from "react";
import EyeOpen from "../../assets/images/open-eye.svg";
import EyeClosed from "../../assets/images/close-eye.svg";

const defaultProps = {
  inputClassName:
    "bg-white border rounded-5 focus:outline-none focus:text-black focus:border-blue-variant-1 border-gray-variant-6 py-3 px-3 w-full appearance-none leading-normal text-sm placeholder:text-gray-variant-3 min-h-[50px]",
  disabled: false,
  labelStyle: "leading-[19px] mb-3 whitespace-nowrap text-[13px]",
};

export const InputBox = (props) => {
  let { inputClassName = defaultProps.inputClassName } = props;
  const {
    type,
    label,
    error,
    touched,
    maxlength,
    moreclass,
    disabled = defaultProps.disabled,
    labelStyle = defaultProps.labelStyle,
    noEye,
    optional,
  } = props;

  const isInError = !!(touched && error);
  if (isInError) {
    inputClassName += " focus:border-error border-error";
  }
  if (disabled) {
    inputClassName =
      inputClassName +
      " cursor-not-allowed border-gray-variant-5 bg-gray-variant-5";
  }

  if (type === "password") {
    inputClassName += " pr-10";
  }

  const [fieldType, setFieldType] = useState("text");

  useEffect(() => {
    setFieldType(type);
  }, [type]);

  const toggleViewPass = () => {
    if (fieldType === "password") {
      setFieldType("text");
    } else {
      setFieldType("password");
    }
  };

  return (
    <div className="relative pb-6">
      <div className=" flex flex-col items-start relative">
        {label && (
          <span className={labelStyle}>
            {label}
            {optional ? (
              <span className="text-gray-variant-3 ml-1 text-[13px]">{`(Optional)`}</span>
            ) : (
              ""
            )}
          </span>
        )}
        <div className="relative w-full">
          <input
            {...props}
            autoComplete="off"
            maxLength={maxlength}
            readOnly={disabled === true}
            type={fieldType}
            className={inputClassName + " " + moreclass}
          />
          {type === "password" && !noEye ? (
            <div className="absolute h-full top-0 right-0 mr-5 flex justify-center items-center">
              <img
                src={fieldType === "password" ? EyeOpen : EyeClosed}
                alt="eye"
                className="w-4 cursor-pointer"
                onClick={toggleViewPass}
              />
            </div>
          ) : null}
        </div>
      </div>
      {touched && error ? (
        <div className="text-error absolute bottom-0 left-0 text-left text-sm first-letter:uppercase py-1 leading-[17px] whitespace-nowrap">
          {error}
        </div>
      ) : null}
    </div>
  );
};

export default InputBox;
