module.exports = {
  testEnvironment: 'miniflare',
  testMatch: ['**/*.test.ts', '**/*.spec.ts'],
  transform: {
    '^.+\\.tsx?$': 'esbuild-jest',
  },
  moduleNameMapper: {
    'jsonpath-plus':
      '<rootDir>/node_modules/jsonpath-plus/dist/index-node-cjs.cjs',
  },
}
