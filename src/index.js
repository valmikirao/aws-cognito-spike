require('es6-promise').polyfill();
require('isomorphic-fetch');

var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var QueryString = require('query-string');

outputStuff = function () {
  outputDiv = document.getElementById('output');

  var query = document.location.hash.substr(1);

  if (query === '') {
    outputDiv.innerText = 'User not logged in'
  }
  else {
    var parsedQuery = QueryString.parse(query);

    var userPool = new AmazonCognitoIdentity.CognitoUserPool({
      UserPoolId : 'us-east-1_xsHfDGvHI', // Your user pool id here
      ClientId : '5kb8ihjt9p9ve0amgqgopfks14' // Your client id here
    });

    var session = new AmazonCognitoIdentity.CognitoUserSession({
      IdToken: new AmazonCognitoIdentity.CognitoIdToken({IdToken: parsedQuery.id_token}),
      AccessToken: new AmazonCognitoIdentity.CognitoAccessToken({AccessToken: parsedQuery.access_token}),
      RefreshToken: new AmazonCognitoIdentity.CognitoRefreshToken()
    });

    console.log(session);

    var cognitoUser = new AmazonCognitoIdentity.CognitoUser({
      Username : 'valmikirao@gmail.com',
      Pool : userPool
    });

    cognitoUser.setSignInUserSession(session);

    cognitoUser.getUserAttributes(function(err, results) {
      if (err) {
          console.error(err);
          return;
      }

      var userFullName = null;
      for (i = 0; i < results.length; i++) {
        var result = results[i];
        if (result.getName() == "name") {
            userFullName = result.getValue();
        }
      }

      if (userFullName === null) {
        outputDiv.innerText = "No Name Error!!!";
      }
      else {
        outputDiv.innerText = "Hello " + userFullName + "!!!";
      }

    });
  }
};
