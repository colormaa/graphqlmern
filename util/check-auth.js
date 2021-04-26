const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server");
const { SECRET } = require("../config");
module.exports = (context) => {
  //context = {...headers}
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    //Bearer djflksd jfalkjf dlsj

    const token = authHeader.split("Bearer ")[1];
    if (token) {
      try {
        const user = jwt.verify(token, SECRET);
        return user;
      } catch (e) {
        throw new AuthenticationError(e);
      }
    }
    throw new Error("Authentication  token  must me  'Bearer [token]");
  }
  throw new Error("Authentication header must be provided");
};
