const jwt = require('./utils/jwt');
const getBearerToken = require('./utils/getBearerToken');
const { makeExecutableSchema, mergeSchemas } = require('graphql-tools');
const { graphqlExpress } = require('apollo-server-express');
const bodyParser = require('body-parser-graphql');
const cors = require('cors');
const express = require('express');
const http = require('http');
const createAppSchema = require('./schemas/appSchema');
const createAdminSchema = require('./schemas/adminSchema');
const createContext = require('./utils/createContext');
// temporary
const config = require('../../example/prismaAdminConfig');

const startup = async () => {
  // import our app schema and local schema
  const appSchema = await createAppSchema();
  const adminSchema = createAdminSchema();

  // create a new server, with /admin pointing to admin API and /app pointing to app API
  const app = express();
  app.use(cors());
  app.use(
    '/admin',
    bodyParser.graphql(),
    graphqlExpress(async request => {
      const context = await createContext({ request });
      return {
        schema: adminSchema,
        context,
        endpointURL: '/admin',
      };
    }),
  );
  app.use(
    '/app',
    bodyParser.graphql(),
    graphqlExpress(async request => {
      const context = await createContext({ request });
      return {
        schema: appSchema,
        context,
        endpointURL: '/app',
      };
    }),
  );

  app.listen(process.env.PORT || 4001, () => console.log('Server running at http://localhost:4001'));
};

startup()
.catch(err => console.error(err));

