Package.describe({
  name: 'hl7-fast:identity-matching',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('2.7.3');
  api.use('ecmascript@0.16.0');
  api.use('clinical:json-routes');
  api.use('clinical:vault-server');
  api.addFiles('routes.js', 'server');
});

Package.onTest(function(api) {
  api.use('ecmascript@0.16.0');
  api.use('tinytest');
  api.use('hl7-fast:identity-matching-module');
  api.mainModule('identity-matching-module-tests.js');
});

Npm.depends({
    'lodash': '4.0.0'
});
