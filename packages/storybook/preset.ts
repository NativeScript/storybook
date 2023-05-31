function managerEntries(entry = []) {
  return [...entry, require.resolve('./src/register')];
}

module.exports = { managerEntries };
