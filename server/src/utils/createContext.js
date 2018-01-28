const { Prisma, forwardTo } = require('prisma-binding');
const prismaTypeInfo = require('./prismaTypeInfo');
const jwt = require('./jwt');
const getBearerToken = require('./getBearerToken');
// temporary
const config = require('../../../example/prismaAdminConfig');

const app = new Prisma(config.appPrisma);

module.exports = async (req, prev) => {
  return ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: 'http://localhost:4466/prisma-admin/dev',
      secret: 'mysecret123',
      debug: true,
    }),
    app,
    appTypeInfo: await prismaTypeInfo(app),
    token: jwt.read(getBearerToken(req.request)),
    jwt,
  });
};
