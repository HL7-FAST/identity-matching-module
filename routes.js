// hl7-fast:identity-matching-module/routes.js

import {
  validateMinimumRequirement,
  calculateWeight,
  calculateScore,
  isMatch,
  MATCHING_SCORE_THRESHOLDS,
  matchGrade
} from "./MatchUtilities.js"

import { get } from 'lodash'

let fhirPath = get(Meteor, 'settings.private.fhir.fhirPath', 'baseR4');


JsonRoutes.add("POST", fhirPath + "/Patient/$match", function(req, res, next) {
    console.log("Invoking Packaged $match!!!");

    var total = 0;
    var entries = [ {resourceType: "TODO"} ];
    var success = true;

    const bundle = {
        resourceType: "bundle",
        type: "searchset",
        total: total,
        entries: entries
    };

    if( success ) {
        JsonRoutes.sendResult(res, {code: 200, data: bundle});
    }
});
