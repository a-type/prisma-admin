const path = require('path');

module.exports = {
  appPrisma: {
    typeDefs: path.resolve(__dirname, '../../current-backend/src/generated/prisma.graphql'),
    endpoint: 'http://localhost:4466/current-backend/dev',
    secret: 'fake_prisma_secret',
    debug: true,
  }
};
