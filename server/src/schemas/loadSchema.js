const fs = require('fs');
const path = require('path');
const { importSchema } = require('graphql-import');

module.exports = schemaPath => {
  const absPath = path.resolve(schemaPath);
  if (!fs.existsSync(absPath)) {
    throw new Error(`Schema was not found: ${absPath}`);
  }

  return importSchema(absPath);
}
