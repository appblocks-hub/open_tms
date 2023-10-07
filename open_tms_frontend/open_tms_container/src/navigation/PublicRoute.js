import React from "react";
import LoginLayout from "../federated_components/login-layout/login-layout";

export const PublicRoute = (props) => {
  return <LoginLayout {...props} />;
};
