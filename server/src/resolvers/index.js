const user = require('./user');
const permission = require('./permission');
const permissionGroup = require('./permissionGroup');
const auth = require('./auth');

module.exports = {
  Query: {
    ...user.Query,
    ...permission.Query,
    ...permissionGroup.Query,
    ...auth.Query,
  },
  Mutation: {
    ...user.Mutation,
    ...permission.Mutation,
    ...permissionGroup.Mutation,
    ...auth.Mutation,
  },
  ...user.types,
  ...permission.types,
  ...permissionGroup.types,
  ...auth.types,
};
