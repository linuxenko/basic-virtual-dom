var browsers = {
  sl_chrome: {
    base: 'SauceLabs',
    browserName: 'chrome',
    version: '35'
  },
  sl_firefox: {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: '30'
  },
  sl_mac_safari: {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'OS X 10.11'
  },
  sl_edge: {
    base: 'SauceLabs',
    browserName: 'MicrosoftEdge',
    platform: 'Windows 10'
  },
  sl_ios_safari_9: {
    base: 'SauceLabs',
    browserName: 'iphone',
    version: '8.3'
  },
  sl_android_4_4: {
    base: 'SauceLabs',
    browserName: 'android',
    version: '4.4'
  }
};

module.exports = function(config) {
  config.set({
    singleRun: true,
    startConnect: true,
    frameworks: [
      'mocha',
      'browserify'
    ],
    files: [
      'tests/mocha-tests/*.js'
    ],
    preprocessors: {
      'tests/mocha-tests/*.js': ['browserify']
    },
    browserify: {
      debug: true
    },
    reporters: ['saucelabs', 'spec'],
    browsers: Object.keys(browsers),
    customLaunchers: browsers
  });
};