export function getClientInformation(url) {
  const configURL = `${url}/ghost/api/v0.1/configuration/`;
  return fetch(configURL)
    .then(function(data) {
      return data.json();
    })
    .then(function(json) {
      return {
        clientId: json.configuration[0].clientId,
        clientSecret: json.configuration[0].clientSecret,
      };
    });
}

function jsonToString(data) {
  let string = '';
  for (key in data) {
    string = string + key + '=' + data[key] + '&';
  }
  string.substring(0, string.lengh - 2);
  return string;
}

export function login(username, password, url, clientSecret, clientId) {
  const tokenURL = `${url}/ghost/api/v0.1/authentication/token`;
  const body = {
    grant_type: 'password',
    username,
    password,
    client_secret: clientSecret,
    client_id: clientId,
  };
  return fetch(tokenURL, {
    method: 'POST',
    body: jsonToString(body),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  }).then(function(data) {
    return data.json();
  });
}

// getClientInformation('http://207.154.225.34/').then(function(data) {
//   console.log(data);
// });
export default {};
