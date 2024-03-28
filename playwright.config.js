// @ts-check
const { defineConfig, devices } = require('@playwright/test');

const config = {
  testDir: './tests',
  timeout: 150 * 1000, //overall Test
  expect: {

    timeout: 5000     //Assertion expect timeout
  },
  // reporter: 'html',
  use: {
    browserName : 'chromium',
    headless : false

  },
};

module.exports = config;
    