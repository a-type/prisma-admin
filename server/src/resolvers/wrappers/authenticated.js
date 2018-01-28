const { get } = require('lodash');
const AuthenticationError = require('../../errors/AuthenticationError');

module.exports = resolver => (parent, input, ctx, info) => {
  if (!get(ctx, 'token.userId')) {
    throw new AuthenticationError();
  }
  return resolver(parent, input, ctx, info);
};
