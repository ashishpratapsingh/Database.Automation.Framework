/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Tells Jest to transform @faker-js/faker even though it's in node_modules
  transformIgnorePatterns: [
    "node_modules/(?!@faker-js/faker)"
  ],
  // Configure multiple reporters for terminal, CI (XML), and visual review (HTML)
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'test-results/junit',
        outputName: 'results.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: true,
      },
    ],
    [
      'jest-html-reporters',
      {
        publicPath: 'test-results/html',
        filename: 'report.html',
        expand: true,
        pageTitle: 'Database Automation Test Report',
      },
    ],
  ],
};