const typesQuery = `
query($rootName: String = "Query") {
  __type(name: $rootName) {
    ...TypeInfo
  }
}

fragment TypeInfo on __Type {
  name
  fields {
    name
    type {
      name
      description
      kind
      ofType {
        name
        kind
        ofType {
          kind
          name
          ofType {
            kind 
            name
          }
        }
      }
    }
  }
}
`;

module.exports = async prisma => {
  const queryTypeInfo = await prisma.request(typesQuery);
  const mutationTypeInfo = await prisma.request(typesQuery, { rootName: 'Mutation' });
  const resolveType = (root, fieldName) => {
    const field = root.fields.find(f => f.name === fieldName);
    if (!field) {
      if (fieldName === '__schema') {
        return '__Schema';
      } else if (fieldName === '__type') {
        return '__Type';
      }
      return null;
    }

    let type = field.type;
    while (type.name === null && type.ofType) {
      type = type.ofType;
    }
    return type.name;
  }

  return {
    getType: (fieldName, isQuery = true) => {
      if (isQuery) {
        return resolveType(queryTypeInfo, fieldName);
      } else {
        return resolveType(mutationTypeInfo, fieldName);
      }
    },
  };
};
