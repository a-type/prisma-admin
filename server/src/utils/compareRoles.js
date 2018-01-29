module.exports = (roleA, roleB) => {
  if (roleA === roleB) {
    return 0;
  }
  if (
    (roleA === 'SUPER_USER' && roleB === 'USER') ||
    (roleA === 'ROOT' && roleB !== 'ROOT') 
  ){
    return 1;
  }

  return -1;
}
