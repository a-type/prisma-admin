const { get } = require('lodash');
const AuthenticationError = require('../../errors/AuthenticationError');
const AuthorizationError = require('../../errors/AuthorizationError');

module.exports = ({
  resourceName,
  operationName,
}) => resolver => async (parent, input, ctx, info) => {
  const userId = get(ctx, 'token.userId');
  if (!userId) {
    throw new AuthenticationError();
  }

  const result = await ctx.db.permissions({ where: { 
    resourceNames_some: resourceName,
    operationNames_some: operationName,

    OR: [{
      users_some: {
        id: userId,
      },
    }, {
      groups_some: {
        users_some: {
          id: userId,
        },
      },
    }],
  } });

  if (!result) {
    throw new AuthorizationError();
  }

  return resolver(parent, input, ctx, info);
};
