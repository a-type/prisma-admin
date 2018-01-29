const AuthorizationError = require('../../../errors/AuthorizationError');

module.exports = conditions => resolver => async (parent, input, ctx, info) => {
  const conditionsArray = Array.isArray(conditions) ? conditions : [conditions];
  let ok = true;
  let condition = 0;
  while (ok && condition < conditionsArray.length) {
    ok = await conditionsArray[condition](parent, input, ctx, info);
    condition++;
  }

  if (!ok) {
    throw new AuthorizationError();
  }

  return resolver(parent, input, ctx, info);
}
