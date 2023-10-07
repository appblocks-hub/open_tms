import React from "react";
import LoaderImg from "../../assets/images/loader.png";

const Button = ({
  name,
  className,
  type,
  Loader,
  isLoading,
  disabled,
  handleButton,
  btnType,
  disableOnValidate,
  icon,
  moreClass,
}) => {
  let buttonClass =
    "flex justify-center items-center w-full min-h-[48px] min-w-[128px] rounded-5 text-base font-bold leading-5 px-4 hover:opacity-80 whitespace-nowrap";
  if (className) {
    buttonClass = className;
  }

  if (disabled || disableOnValidate || isLoading) {
    buttonClass += " bg-gray-variant-2 text-white cursor-not-allowed";
  } else {
    if (btnType === "primary") {
      buttonClass += " bg-primary text-white";
    } else if (btnType === "secondary") {
      buttonClass += " bg-white border border-black text-black";
    } else if (btnType === "terinary") {
      buttonClass += " bg-white border-none  text-black";
    } else if (btnType === "info") {
      buttonClass += " bg-info border-none  text-white";
    }
  }
  return (
    <button
      className={buttonClass + " " + moreClass}
      type={type}
      disabled={disabled || isLoading}
      onClick={() => {
        if (!disableOnValidate && type === "button") {
          handleButton();
        }
      }}
    >
      {icon ? (
        <img className="mr-[14px] w-[14px]" src={icon} alt="btn_icon" />
      ) : null}
      {isLoading
        ? Loader || (
            <img src={LoaderImg} className="w-[26px] infinite-rotate flex" />
          )
        : name}
    </button>
  );
};

export default Button;
