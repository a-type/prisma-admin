const { makeRemoteExecutableSchema, introspectSchema } = require('graphql-tools');
const { makePrismaLink } = require('prisma-binding');
const { sign } = require('jsonwebtoken');
const createContext = require('../utils/createContext');
const { setContext } = require('apollo-link-context');
const { ApolloLink } = require('apollo-link');
const authLink = require('../utils/authLink');
// temporary
const config = require('../../../example/prismaAdminConfig');

module.exports = async () => {
  const contextLink = setContext(
    (req, previousContext) => {
      return previousContext.graphqlContext
        ? previousContext.graphqlContext
        : createContext(req)
    },
  );
  const prismaLink = makePrismaLink({
    endpoint: config.appPrisma.endpoint,
    token: sign({}, config.appPrisma.secret),
    debug: config.appPrisma.debug,
  });
  const link = ApolloLink.from([
    contextLink,
    authLink,
    prismaLink,
  ]);
  const schema = await introspectSchema(link);
  return makeRemoteExecutableSchema({
    schema,
    link,
  });
};
