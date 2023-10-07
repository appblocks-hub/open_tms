import jwt_decode from "jwt-decode";

function getLocalStorage(name) {
  return JSON.parse(localStorage?.getItem(name));
}

function setLocalStorage(name, data) {
  localStorage.setItem(name, JSON.stringify(data));
}

function removeLocalStorage(name, data) {
  localStorage.removeItem(name);
}

function checkValidUser() {
  const token = localStorage.getItem("AUTH_DETAILS");
  let decodedToken;
  if (token) {
    decodedToken = jwt_decode(token);
  }
  return !!decodedToken?.userId;
}

function getUserDetails() {
  const token = localStorage.getItem("AUTH_DETAILS");
  let decodedToken;
  if (token) {
    decodedToken = jwt_decode(token);
  }
  return decodedToken;
}

const helpers = {
  getLocalStorage,
  setLocalStorage,
  checkValidUser,
  getUserDetails,
  removeLocalStorage,
};

export default helpers;
