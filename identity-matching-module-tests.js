// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by identity-matching-module.js.
import { name as packageName } from "meteor/hl7-fast:identity-matching-module";

// Write your tests here!
// Here is an example.
Tinytest.add('identity-matching-module - example', function (test) {
  test.equal(packageName, "identity-matching-module");
});
