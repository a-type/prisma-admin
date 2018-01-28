const { merge } = require('lodash');

module.exports = (query, context) => {
  const isReadDefinition = definition => definition.operation === 'query';
  const getSelectionTypeName = (selection, isQuery) => {
    const typeName = context.appTypeInfo.getType(selection.name.value, isQuery);
    return typeName;
  };
  const getSelectionPermissionType = (isQuery, fieldName) => {
    if (isQuery) {
      return 'READ';
    } else if (fieldName.indexOf('create') === 0) {
      return 'CREATE';
    } else if (fieldName.indexOf('update') === 0) {
      return 'UPDATE';
    } else if (fieldName.indexOf('delete') === 0) {
      return 'DELETE';
    } else {
      console.warn(`Unknown mutation CRUD type for ${fieldName}`);
      return 'ALL';
    }
  };
  const getSelectionPermission = (isQuery, selection) => {
    const typeName = getSelectionTypeName(selection, isQuery);
    const fieldName = selection.name.value;
    const permissionType = getSelectionPermissionType(isQuery, fieldName);
    return { type: typeName, operation: permissionType };
  };
  const getDefinitionPermissionModel = definition => {
    if (!definition.selectionSet || !definition.selectionSet.selections) {
      return {};
    }
    const fieldSelections = definition.selectionSet.selections.filter(s => s.kind === 'Field');
    return fieldSelections
      .reduce((all, s) => {
        const permissions = getSelectionPermission(isReadDefinition(definition), s);
        return {
          ...all,
          [permissions.type]: {
            ...all[permissions.type],
            [permissions.operation]: true, // TODO: extend with fields?
          },
        };
      }, {});
  };
  
  return query.definitions
    .filter(d => d.kind === 'OperationDefinition')
    .reduce((all, d) => {
      const permissionModel = getDefinitionPermissionModel(d);
      return merge(all, permissionModel);
    }, {});
};
