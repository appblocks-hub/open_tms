import jwt from "jsonwebtoken";
import { env } from "@appblocks/node-sdk";

env.init();

const authenticateUser = async (req) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  try {
    if (token == null) throw new Error();
    const data = jwt.verify(token, process.env.BB_AUTH_SECRET_KEY.toString());
    return data;
  } catch (e) {
    const error = new Error("An error occurred.");
    error.errorCode = 401;
    throw error;
  }
};

export default authenticateUser;
