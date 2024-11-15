const { expressjwt: expressJwt } = require("express-jwt");

function authJwt() {
  const secret = process.env.ACCESS_TOKEN_KEY;

  // isRevoked: isRevoked
  return async (req, res, next) => {
    try {
      return expressJwt({
        secret,
        algorithms: ["HS256"],
      }).unless({
        path: [
          `/api/v1/auth/register`,
          `/api/v1/auth/login`,
          `/api/v1/auth/forget-password-mail`,
          `/api/v1/auth/verify-link`,
          `/api/v1/auth/set-password-mail`,
          `/api/v1/admin/register`,
          `/api/v1/admin/login`,
          `/api/v1/admin/forget-password-mail`,
          `/api/v1/admin/verify-link`,
          `/api/v1/admin/set-password-mail`,
        ],
      })(req, res, next);
    } catch (error) {
      console.log(error);
      return res.status(403).json({ status: 0, message: "Forbidden" });
    }
  };
}

module.exports = authJwt;
