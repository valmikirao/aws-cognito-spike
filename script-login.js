require('es6-promise').polyfill();
require('isomorphic-fetch');
AmazonCognitoIdentity = require('amazon-cognito-identity-js');
AWS = require('aws-sdk/global');

var authenticationData = {
  Email : 'valmikirao@gmail.com',
  Password : 'Insecure123!',
};
var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
var poolData = {
  UserPoolId : 'us-east-1_xsHfDGvHI', // Your user pool id here
  ClientId : '5kb8ihjt9p9ve0amgqgopfks14' // Your client id here
};
var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
var userData = {
  Username : 'valmikirao@gmail.com',
  Pool : userPool
};
var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

cognitoUser.authenticateUser(authenticationDetails, {
  onSuccess: function (result) {
      console.log('payload', result.getAccessToken().payload);
      cognitoUser.getUserAttributes(function(err, result) {
        if (err) {
            console.error(err);
            return;
        }
        for (i = 0; i < result.length; i++) {
            console.log('attribute ' + result[i].getName() + ' has value ' + result[i].getValue());
        }
    });
  },

  onFailure: function(err) {
      console.error(err);
  },

  mfaSetup: function(challengeName, challengeParameters) {
      cognitoUser.associateSoftwareToken(this);
  },

  associateSecretCode : function(secretCode) {
      var challengeAnswer = prompt('Please input the TOTP code.' ,'');
      cognitoUser.verifySoftwareToken(challengeAnswer, 'My TOTP device', this);
  },

  selectMFAType : function(challengeName, challengeParameters) {
      var mfaType = prompt('Please select the MFA method.', ''); // valid values for mfaType is "SMS_MFA", "SOFTWARE_TOKEN_MFA" 
      cognitoUser.sendMFASelectionAnswer(mfaType, this);
  },

  totpRequired : function(secretCode) {
      var challengeAnswer = prompt('Please input the TOTP code.' ,'');
      cognitoUser.sendMFACode(challengeAnswer, this, 'SOFTWARE_TOKEN_MFA');
  },

  mfaRequired: function(codeDeliveryDetails) {
      var verificationCode = prompt('Please input verification code' ,'');
      cognitoUser.sendMFACode(verificationCode, this);
  }
});
