const authenticated = require('./authenticated');
const hasPermission = require('./hasPermission');
const hasRole = require('./hasRole');

module.exports = {
  hasPermission,
  authenticated,
  hasRole,
};
