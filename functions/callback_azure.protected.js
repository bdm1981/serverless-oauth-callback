const axios = require("axios");
const crypto = require("crypto");
const qs = require("qs");

// Grab function path
const oauthpath = Runtime.getFunctions().oauth.path;

// // Next, simply use the standard require() to bring the library into scope
const auth = require(oauthpath);

exports.handler = function (context, event, callback) {
  //The event we're processing
  console.log("***** RAW Event *****");
  console.log(`Twilio Event: ${event}`);

  // IIFE Async to execute the Token Swap
  let messageRelay = (async () => {
    let token = await auth.getTokensForProvider("azure");
    return await postMessageRelay(token.data, event);
  })();

  // IIFE async still return a Promise
  messageRelay.then((res) => {
    callback(null);
  });
};

/**
 * Function to relay inbound message with token
 *
 * @param {string} token A valid Access Token for the provider
 * @param {Object} event Event passed from Twilio Function
 * @returns {Object} Returns message
 */
async function postMessageRelay(token, event) {
  // remove headers from the event request
  delete event.request;
  let config = {
    method: "post",
    url: process.env.RELAY_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Twilio-Signature": getSignature(
        process.env.AUTH_TOKEN,
        process.env.RELAY_URL,
        event
      ),
    },
    data: qs.stringify(event),
  };

  await axios(config);

  return;
}

function getSignature(authToken, url, params) {
  // get all request parameters
  var data = Object.keys(params)
    // sort them
    .sort()
    // concatenate them to a string
    .reduce((acc, key) => acc + key + params[key], url);
  return (
    crypto
      // sign the string with sha1 using your AuthToken
      .createHmac("sha1", authToken)
      .update(Buffer.from(data, "utf-8"))
      // base64 encode it
      .digest("base64")
  );
}
