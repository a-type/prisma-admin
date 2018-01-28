const { get } = require('lodash');
const AuthenticationError = require('../../errors/AuthenticationError');
const AuthorizationError = require('../../errors/AuthorizationError');

module.exports = role => resolver => async (parent, input, ctx, info) => {
  const userId = get(ctx, 'token.userId');
  if (!userId) {
    throw new AuthenticationError();
  }

  const result = await ctx.db.user({ 
    where: { 
      id: userId,
      role: role,
    } 
  });

  if (!result) {
    throw new AuthorizationError();
  }

  return resolver(parent, input, ctx, info);
};
