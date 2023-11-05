module.exports = {
  testEnvironment: 'miniflare',
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'esbuild-jest',
      {
        sourcemap: true,
      },
    ],
  },
  clearMocks: true,
};
