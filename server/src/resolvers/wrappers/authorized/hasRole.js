const { get } = require('lodash');
const compareRoles = require('../../../utils/compareRoles');
const AuthenticationError = require('../../../errors/AuthenticationError');

module.exports = role => async (parent, input, ctx, info) => {
  const userId = get(ctx, 'token.userId');
  if (!userId) {
    throw new AuthenticationError();
  }

  const result = await ctx.db.query.user({ 
    where: { 
      id: userId,
    } 
  }, `{ role }`);

  return compareRoles(result.role, role) >= 0;
};
