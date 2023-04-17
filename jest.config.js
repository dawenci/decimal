module.exports = {
  moduleFileExtensions: ['js', 'ts'],
  // 匹配 ts 文件
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  // 忽略的目录
  transformIgnorePatterns: [ '/node_modules/' ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testMatch: [ '**/tests/unit/**/*.spec.(js|ts)|**/__tests__/*.(js|ts)' ],
  // 统计覆盖率
  collectCoverage: true,
  collectCoverageFrom: [ 'src/**/*.{js,ts}', '!**/node_modules/**', '!src/**/*.d.ts' ],
  coverageDirectory: '<rootDir>/tests/unit/coverage',
  coverageReporters: [ 'lcov', 'text-summary' ],
  // testURL: 'http://localhost/',
  // watchPlugins: [ 'jest-watch-typeahead/filename', 'jest-watch-typeahead/testname' ]
  // globals: {
  //   'ts-jest': {
  //     babelConfig: true
  //   }
  // }
}
