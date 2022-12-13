function managerEntries(entry = []) {
  return [...entry, require.resolve('./sb/register')];
}

module.exports = { managerEntries };
