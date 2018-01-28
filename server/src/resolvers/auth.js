const bcrypt = require('bcryptjs');
const { authenticated } = require('./wrappers');
const AuthenticationError = require('../errors/AuthenticationError');

// resolve 'AuthPayload' type
const AuthPayload = {
  user: async ({ user: { id } }, args, ctx, info) => {
    return ctx.db.query.user({ where: { id } }, info);
  },
};

// register a new user
async function signup(parent, args, ctx, info) {
  const password = await bcrypt.hash(args.password, 10);
  console.info(ctx.db);
  const user = await ctx.db.mutation.createUser({
    data: { ...args, password },
  });

  return {
    token: ctx.jwt.create(user.id),
    user,
  };
}

// log in an existing user
async function login(parent, { email, password }, ctx, info) {
  const user = await ctx.db.query.user({ where: { email } });
  if (!user) {
    throw new AuthenticationError();
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new AuthenticationError();
  }

  return {
    token: ctx.jwt.create(user.id),
    user,
  };
}

module.exports = {
  Query: {
  },
  Mutation: {
    signup,
    login,
  },
  types: {
    AuthPayload,
  },
};
