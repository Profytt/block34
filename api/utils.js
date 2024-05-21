const jwt = require('jsonwebtoken');
const { getUserById } = require('../db'); 

async function requireUser(req, res, next) {
  try {
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');

    if (!auth) {
      next({
        name: 'AuthorizationHeaderError',
        message: `Authorization token must start with ${prefix}`,
      });
    }

    if (auth.startsWith(prefix)) {
      const token = auth.slice(prefix.length);

      try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        if (id) {
          const user = await getUserById(id);
          if (user) {
            req.user = user;
            next();
          } else {
            next({
              name: 'UserNotFoundError',
              message: 'User not found'
            });
          }
        }
      } catch ({ name, message }) {
        next({ name, message });
      }
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  requireUser,
};