const { authenticated } = require('./wrappers');
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

const updateUser = authenticated((parent, input, ctx, info) => {
  const userId = ctx.token.userId;
  return ctx.db.mutation.updateUser({ ...input, where: { id: userId } }, info);
});

const deleteUser = authenticated((parent, { id }, ctx, info) => {
  return ctx.db.query.deleteUser({ where: { id } }, info);
});

module.exports = {
  Query: {
    user,
    users,
    me,
  },
  Mutation: {
    updateUser,
    deleteUser,
  },
};
