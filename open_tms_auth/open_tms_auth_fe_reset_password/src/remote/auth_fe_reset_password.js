import React, { useState } from "react";
import { useFormik } from "formik";
import validation from "./services/validation.js";
import auth from "./services/apis/auth.js";
import { useNavigate, Link, useLocation } from "react-router-dom";
import InputBox from "./common/InputBox/InputBox";
import Button from "./common/Button/Button";

export const ResetPassword = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const user_auth_token = searchParams.get("userAuthToken");

  const [loader, setLoader] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    onSubmit: (values) => {
      const valuesForm = {
        user_auth_token,
        new_password: values.password,
      };
      setLoader(true);
      auth
        .resetPass(valuesForm)
        .then((response) => {
          setApiError("");
          setLoader(false);
          navigate(`/login`);
        })
        .catch((error) => {
          console.log(error?.response);
          setApiError(error?.response?.data?.message);
          setTimeout(() => setApiError(""), 5000);
          formik.setTouched({});
          setLoader(false);
        });
    },
    validationSchema: validation.resetPassSchema,
  });

  return (
    <div className="default w-full float-left flex sm:block bg-white sm:mt-16">
      <div className="w-full flex flex-col items-center sm:justify-center pt-16 sm:p-2 main-wraper">
        <div className="w-full sm:max-w-[500px] bg-white sm:border sm:border-mid-gray sm:rounded-sm sm:min-h-0 p-8 sm:p-12 sm:shadow-lg min-h-screen">
          <div className="flex flex-col">
            <h2 className="text-3xl font-bold mb-6">Create New Password</h2>
            <form onSubmit={formik.handleSubmit}>
              <div className="mb-2">
                <InputBox
                  autoFocus
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  label="New Password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  error={formik.errors.password}
                  touched={formik.touched.password?.toString()}
                />
              </div>
              <div className="mb-6 relative">
                <InputBox
                  onPaste={(e) => e.preventDefault()}
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Enter confirm password"
                  label="Confirm Password"
                  noEye={!formik.values.password || formik.errors.password}
                  disabled={!formik.values.password || formik.errors.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmPassword}
                  error={formik.errors.confirmPassword}
                  touched={formik.touched.confirmPassword?.toString()}
                />
                {apiError ? (
                  <div className="absolute text-error text-left text-sm first-letter:uppercase bg-white py-1 leading-[17px]">
                    {apiError}
                  </div>
                ) : null}
              </div>
              <div className="flex flex-col mb-6 text-[#3D3D3D] text-[13px] leading-6">
                <span>Password must be at least 8 characters long.</span>
                <span>Password must contain at least one upper case.</span>
                <span>One lower case letter.</span>
                <span>One number and one special character</span>
              </div>
              <div className="mb-5">
                <Button
                  type="submit"
                  name="Reset Password"
                  btnType="primary"
                  disabled={
                    formik.errors.confirmPassword ||
                    !formik.values.confirmPassword ||
                    loader
                  }
                  isLoading={loader}
                />
              </div>
              <div className="flex justify-center absolute bottom-0 right-0 w-full bg-white pb-6 pt-3">
                <span className="">
                  Already have an account.
                  <Link to="/login" className="text-success font-semibold">
                    Sign In
                  </Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ResetPassword;
