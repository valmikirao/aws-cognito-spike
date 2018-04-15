require('es6-promise').polyfill();
require('isomorphic-fetch');
AmazonCognitoIdentity = require('amazon-cognito-identity-js');
AWS = require('aws-sdk/global');
QueryString = require('query-string');

var url = process.argv[2];

var query = url.replace(/.*?#/, '')
var parsedQuery = QueryString.parse(query)

// console.log(parsedQuery);

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
cognitoUser.getUserAttributes(function(err, result) {
    if (err) {
        console.error(err);
        return;
    }
    for (i = 0; i < result.length; i++) {
        console.log('attribute ' + result[i].getName() + ' has value ' + result[i].getValue());
    }
});
