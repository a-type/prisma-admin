const { forwardTo } = require('graphql-binding/dist/utils');
const { authenticated, authorized } = require('./wrappers');

const permissionGroup = authenticated(forwardTo('db'));

const permissionGroups = authenticated(forwardTo('db'));

const createPermissionGroup = authorized.all(
  authorized.hasRole('SUPER_USER')
)(forwardTo('db'));

const updatePermissionGroup =authorized.all(
  authorized.hasRole('SUPER_USER')
)(forwardTo('db'));

const deletePermissionGroup = authorized.all(
  authorized.hasRole('SUPER_USER')
)(forwardTo('db'));

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
