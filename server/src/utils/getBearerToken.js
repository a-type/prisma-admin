module.exports = req => {
  if (!req) {
    console.log('no request');
    return null;
  }
  const authHeader = req.get('Authorization');
  if (authHeader) {
    return authHeader.replace('Bearer ', '');
  }
  return null;
};
