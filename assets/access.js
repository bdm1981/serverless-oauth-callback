let Box = {
  baseurl: "https://account.box.com/api/oauth2/authorize",
  clientid: "",
  resptype: "code",
};

function authredirectBox() {
  window.location.href = `${Box.baseurl}?client_id=${Box.clientid}&response_type=${Box.resptype}`;
}

let Google = {
  baseurl: "https://accounts.google.com/o/oauth2/v2/auth",
  access_type: "offline", //require to receive refresh token from Google
  prompt: "consent", //required to force consent to generate refresh token
  clientid: "",
  scope: "https://www.googleapis.com/auth/spreadsheets",
  redirect_uri: "https://example.com", //required
  response_type: "code",
};

function authredirectGoogle() {
  window.location.href = `${Google.baseurl}?access_type=${Google.access_type}&response_type=${Google.response_type}&client_id=${Google.clientid}&redirect_uri=${Google.redirect_uri}&scope=${Google.scope}&prompt=${Google.prompt}`;
}
