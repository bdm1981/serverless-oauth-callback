const axios = require("axios");

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
 * Function to test OAuth for the Box service
 *
 * @param {string} token A valid Access Token for the provider
 * @param {Object} event Event passed from Twilio Function
 * @returns {Object} Returns a Box Comment
 */
async function postMessageRelay(token, event) {
  console.log("event: ", event);
  let results = await axios.post(process.env.RELAY_URL, event, {
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log(results);
  return;
}
