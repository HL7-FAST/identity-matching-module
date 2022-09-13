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

import { RestHelpers } from 'meteor/clinical:vault-server/FhirServer/RestHelpers'


let fhirPath = get(Meteor, 'settings.private.fhir.fhirPath', 'baseR4');


JsonRoutes.add("POST", fhirPath + "/Patient/$match", function(req, res, next) {
    console.log("Invoking Packaged $MATCH!!!");

    let matchParams = get(req, 'body.parameter[0].resource');
	let matchingRecords = [];
	let matchScores = [];

	console.log('weight:', calculateWeight(matchParams));
	console.log('validate minimum requirement:', validateMinimumRequirement(matchParams));
	if( validateMinimumRequirement(matchParams) != 0 ) {
        console.log("Should reject! because input not valid weight");
        JsonRoutes.sendResult(res, {
          code: 400,
          data: {
            "resourceType": "OperationOutcome",
            "severity": "warning",
            "code": "invalid",
            "details": {
              "text": "Invalid or missing Profile, or profile requirements not met",
              "coding": {
                "system": "http://terminology.hl7.org/CodeSystem/operation-outcome",
                "value": "MSG_PARAM_INVALID",
                "display": 'Parameter "meta.profile" content is invalid'
              }
            }
          }
        });
	} else {
    Patients.find().forEach(function (record, idx, cursor) {
          console.log(get(record, 'gender'));
      if( isMatch(record, matchParams, "good") ) {
        console.log("Found matching record at", idx);
        matchingRecords.push(record);
        matchScores.push( calculateScore(record, matchParams) );
      }
    });
    console.log("Final scores:", matchScores);

      let payload = [];

      if(matchingRecords.length === 0 ){
          JsonRoutes.sendResult(res, {
            code: 400,
            data: {
              "resourceType": "OperationOutcome",
              "severity": "warning",
              "code": "invalid",
              "details": {
                "text": "No Resource found matching the query",
                "coding": {
                  "system": "http://terminology.hl7.org/CodeSystem/operation-outcome",
                  "value": "MSG_NO_MATCH",
                  "display": "No Resource found matching the query"
                }
              }
            }
          });
      } else {
          matchingRecords.forEach(function(record, index){
              // console.log('record', get(record, 'name'))

              // record.extension = [{
              //     url: "https://build.fhir.org/ig/HL7/fhir-directory-attestation/match-quality",
              //     valueDecimal: matchScores[index]
              // }];

              delete record.text;


              payload.push({
                  fullUrl: '/' + fhirPath + "/Patient/" + get(record, 'id'),
                  resource: RestHelpers.prepForFhirTransfer(record),
                  search: {
                    "extension": [{
                      "url": "http://hl7.org/fhir/StructureDefinition/match-grade",
                      "valueCode": matchGrade(matchScores[index])
                    }],
                    mode: "match",
                    score: matchScores[index]
                  },
                  request: {
                      method: "POST",
                      url: '/' + fhirPath + '/Patient/$match'
                  },
                  response: {
                    status: "200"
                  }
              });
          });

          console.log('payload', payload);

          let payloadBundle = Bundle.generate(payload);


          // Success
          JsonRoutes.sendResult(res, {
            code: 200,
            data: payloadBundle
          });
      }
  }
});
