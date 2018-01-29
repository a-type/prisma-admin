const { authenticated, authorized } = require('./wrappers');
const { forwardTo } = require('prisma-binding');

// query the current user
const me = authenticated((parent, args, ctx, info) => {
  const id = ctx.token.userId;
  return ctx.db.query.user({ where: { id } }, info);
});

const user = authenticated((parent, { id }, ctx, info) => {
  return ctx.db.query.user({ where: { id } }, info);
});

const users = authenticated(forwardTo('db'));

const isOwnUser = (parent, input, ctx, info) => 
  ctx.token.userId === (input.id || input.data.id);
const hasHigherRole = async (parent, input, ctx, info) => {
  const userId = ctx.token.userId;
  const targetId = input.id || input.data.id;
  const self = await ctx.db.query.user({ where: { id: userId } });
  const user = await ctx.db.query.user({ where: { id: targetId } });
  if (user.role === 'USER' && self.role !== 'USER') {
    return true;
  } else if (user.role === 'SUPER_USER' && self.role === 'ROOT') {
    return true;
  }
  return false;
};

const updateUser = authenticated(
  authorized.any([
    authorized.hasRole('SUPER_USER'),
    isOwnUser,
  ])((parent, input, ctx, info) => {
    const userId = {};
    return ctx.db.mutation.updateUser({ ...input, where: { id: userId } }, info);
  }),
);

const deleteUser = authenticated(
  authorized.all([
    hasHigherRole,
  ])((parent, { id }, ctx, info) => {
    return ctx.db.mutation.deleteUser({ where: { id } }, info);
  }),
);

const addUserPermissions = authenticated(
  authorized.all([
    hasHigherRole,
  ])((parent, { id, permissionIds }, ctx, info) => {
    return ctx.db.mutation.updateUser({
      data: {
        permissions: {
          connect: permissionIds.map(permissionId => ({
            id: permissionId,
          })),
        },
      },
      where: {
        id
      }
    }, info);
  }),
);

module.exports = {
  Query: {
    user,
    users,
    me,
  },
  Mutation: {
    updateUser,
    deleteUser,
    addUserPermissions,
  },
};
