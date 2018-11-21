const express = require("express");
const router = express();
const octokit = require("@octokit/rest")();
var fs = require('fs');


const appId = 19944;
const privateKey = fs.readFileSync('./private.pem');
const jsonwebtoken = require("jsonwebtoken");
const now = Math.floor(Date.now() / 1000);
const payload = {
  iat: now, // Issued at time
  exp: now + 60, // JWT expiration time
  iss: appId
};
const bearer = jsonwebtoken.sign(payload, privateKey, { algorithm: "RS256" });

octokit.authenticate({
  type: "app",
  token: bearer
});

router.post("/build", function(req, res, next) {
const installation_id = req.body.installation;
  octokit.apps.createInstallationToken({installation_id}).then(result => {
    console.log(result.data.token);
    octokit.authenticate({
      type: "token",
      token: `${result.data.token}`
    });

    octokit.issues
      .createComment({
        owner: "inyee786",
        repo: req.body.repo,
        number: req.body.pull,
        body: 
`Total | Executed | Passed | Failed
:------------: | :-------------: | :-------------: | :-------------: |
 ${req.body.build.total} |  ${req.body.build.executed} | ${req.body.build.passed} | ${req.body.build.failed}
`
        
      })
      .then(result => {
        console.log(result);
        res.status(200).end();
      });
  });

});



module.exports = router;
