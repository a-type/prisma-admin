const { forwardTo } = require('graphql-binding/dist/utils');
const { authenticated, authorized } = require('./wrappers');

const permission = authenticated(forwardTo('db'));

const permissions = authenticated(forwardTo('db'));

const createPermission = authorized.all(
  authorized.hasRole('SUPER_USER')
)(forwardTo('db'));

const updatePermission = authorized.all(
  authorized.hasRole('SUPER_USER')
)(forwardTo('db'));

const deletePermission = authorized.all(
  authorized.hasRole('SUPER_USER')
)(forwardTo('db'));

module.exports = {
  Query: {
    permission,
    permissions,
  },
  Mutation: {
    createPermission,
    updatePermission,
    deletePermission,
  },
};
