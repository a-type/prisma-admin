const { forwardTo } = require('graphql-binding/dist/utils');

const { authenticated, hasRole } = require('./wrappers');

const permissionGroup = authenticated(forwardTo('db'));

const permissionGroups = authenticated(forwardTo('db'));

const createPermissionGroup = hasRole('SUPER_USER', forwardTo('db'));

const updatePermissionGroup = hasRole('SUPER_USER', forwardTo('db'));

const deletePermissionGroup = hasRole('SUPER_USER', forwardTo('db'));

module.exports = {
  Query: {
    permissionGroup,
    permissionGroups,
  },
  Mutation: {
    createPermissionGroup,
    updatePermissionGroup,
    deletePermissionGroup,
  },
};
