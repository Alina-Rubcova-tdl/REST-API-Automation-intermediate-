## Tech Stack

**Libraries:** chai, mocha, supertest, get-nested-value, mochawesome

**Requirements:** Node (min version 14)


## Installation

Install with npm

```bash
  npm install
```
    
## Running Tests

To run tests, run the following command

```bash
  npm run $testSetName $env
```
$testSetName - mandatory param, test set name. List of the supported test sets:
 - user
 - user-negative

$env - environment 
 - STG
 - PROD


## Url documentation for Api commands

https://food-api.tdlbox.com/swagger/#/Restaurants/post_restaurants

#### Execution report can be find at /mochawesome-report/mochawesome.html