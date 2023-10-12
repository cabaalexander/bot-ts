module.exports = {
  'src/**/*.(j|t)s': ['yarn lint', 'yarn test:staged'],
  '**/*.ts?(x)': () => 'yarn check-types',
};
