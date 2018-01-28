const { ApolloLink, Observable } = require('apollo-link');
const { get, omit } = require('lodash');
const AuthenticationError = require('../errors/AuthenticationError');
const AuthorizationError = require('../errors/AuthorizationError');
const parseQueryPermissions = require('./parseQueryPermissions');
const flatten = require('./flattenPermissionsModel');

// fields which anon users can access
const ANON_FIELDS = ['__Schema', '__Type'];

module.exports = new ApolloLink((operation, forward) =>
  new Observable(observer => {
    let handle;

    const context = operation.getContext();
    const rawPermissionsModel = parseQueryPermissions(operation.query, context);

    const permissionsModel = omit(rawPermissionsModel, ANON_FIELDS);

    console.info('Operation permission model:');
    console.info(JSON.stringify(permissionsModel, null, ' '));

    // query admin db for permissions required
    const userId = get(context, 'token.userId');
    if (!userId && Object.keys(permissionsModel).length > 0) {
      throw new AuthenticationError();
    }

    const createAuthQuery = (modelName, crudOperation) => ({
      where: {
        resourceName: modelName,
        allowedOperation: crudOperation,

        OR: [{
          users_some: {
            id: userId,
          },
        }, {
          groups_some: {
            users_some: {
              id: userId,
            },
          },
        }],
      },
    });

    const flatPermissionsModel = flatten(permissionsModel);

    Promise.all(
      flatPermissionsModel
        .map(tuple => createAuthQuery(tuple[0], tuple[1]))
        .map(query => context.db.query.permissions(query)),
    ).then(permissionResults => {
      if (permissionResults.filter(r => r.length).length !== flatPermissionsModel.length) {
        throw new AuthorizationError();
      }
    })
    .then(() => {
      handle = forward(operation).subscribe({
        next: observer.next.bind(observer),
        error: observer.error.bind(observer),
        complete: observer.complete.bind(observer),
      });
    })
    .catch(observer.error.bind(observer));

    return () => {
      if (handle) handle.unsubscribe();
    };
  }),
);
