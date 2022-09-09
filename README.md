# Identity Matching Module

Node-on-Fhir package for `Patient/$match` operation for [Interoperable identity and patient matching implementation guide](http://build.fhir.org/ig/HL7/fhir-identity-matching-ig/).

### Note: This will eventually become a factor of identity-matching-server

## Dependencies
 - [MeteorJS](https://www.meteor.com/)

## Quickstart

```bash
# fetch boilerplate
git clone https://github.com/clinical-meteor/node-on-fhir
cd node-on-fhir

# install dependencies
meteor npm install

# run the app; make sure it compiles
meteor run 

# add core FHIR resources and run server
meteor add clinical:vault-server
meteor run --settings configs/settings.nodeonfhir.localhost.json

# test API endpoints
curl http://localhost:3000/baseR4/metadata
curl http://localhost:3000/baseR4/Patient

# add identity-matching feature
git submodule add https://github.com/HL7-FAST/identity-matching-module.git packages/identity-matching
meteor add hl7-fast:identity-matching

# launch server
meteor run --settings configs/settings.nodeonfhir.localhost.json
```

## Example FHIR Communication
#### Request
```http
POST /baseR4/Patient/$match HTTP/1.1
Accept-Encoding: gzip, deflate
Connection: keep-alive
Content-Length: 613
Content-Type: application/json
Host: localhost:3000
User-Agent: HTTPie/3.2.1
accept: application/fhir+json

{
    "id": "example-param-1",
    "parameter": [
        {
            "name": "resource",
            "resource": {
                "birthDate": "1991-12-31",
                "gender": "female",
                "id": "example-1",
                "meta": {
                    "profile": [
                        "http://hl7.org/fhir/us/identity-matching/StructureDefinition/IDI-Patient"
                    ]
                },
                "name": [
                    {
                        "family": "Doe",
                        "given": [
                            "Jane"
                        ]
                    }
                ],
                "resourceType": "Patient"
            }
        },
        {
            "name": "onlyCertainMatches",
            "valueBoolean": "false"
        }
    ],
    "resourceType": "Parameters"
}
```

#### Response
```http
HTTP/1.1 200 OK
access-control-allow-header: *
access-control-allow-origin: *
cache-control: no-store
connection: keep-alive
date: Fri, 09 Sep 2022 15:10:24 GMT
keep-alive: timeout=5
pragma: no-cache
transfer-encoding: chunked

{
  "resourceType": "Bundle",
  "type": "searchset",
  "entry": [
    {
      "fullUrl": "/baseR4/Patient/2",
      "resource": {
        "resourceType": "Patient",
        "id": "2",
        "name": [
          {
            "family": "Doe",
            "given": [
              "Jane"
            ]
          }
        ],
        "gender": "female",
        "birthDate": "1991-12-31",
        "meta": {
          "versionId": "1",
          "lastUpdated": "2022-09-09T14:25:31.212Z"
        },
        "active": true,
        "_birthDate": "1991-12-31T05:00:00.000Z"
      },
      "search": {
        "extension": [
          {
            "url": "http://hl7.org/fhir/StructureDefinition/match-grade",
            "valueCode": "possible"
          }
        ],
        "mode": "match",
        "score": 0.65
      },
      "request": {
        "method": "POST",
        "url": "/baseR4/Patient/$match"
      },
      "response": {
        "status": "200"
      }
    }
  ],
  "total": 1
}
```


## License

Copyright 2022 The MITRE Corporation

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
```
http://www.apache.org/licenses/LICENSE-2.0
```
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
