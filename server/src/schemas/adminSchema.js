const loadSchema = require('./loadSchema');
const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('../resolvers');

module.exports = () => {
  const localTypeDefs = loadSchema('./src/schema.graphql');
  return makeExecutableSchema({
    typeDefs: localTypeDefs,
    resolvers,
  });
};
