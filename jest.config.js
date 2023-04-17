module.exports = {
  // 支持 ts 文件中，使用 `.js` 后缀 import 模块
  resolver: "ts-jest-resolver",
  moduleFileExtensions: ['js', 'ts'],
  // 匹配 ts 文件
  transform: {
    '^.+\\.[jt]s$': 'ts-jest'
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
}
