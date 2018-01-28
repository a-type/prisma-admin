module.exports = model => Object.keys(model).reduce((flat, resourceName) => {
  const tuples = Object.keys(model[resourceName])
    .filter(operationName => !!model[resourceName][operationName])  
    .reduce((all, operationName) => [...all, [resourceName, operationName]], []);
  return [...flat, ...tuples];
}, []);
