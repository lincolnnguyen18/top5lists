const loggedIn = async() => {
  return fetch('/api/username', {
    method: 'GET'
  }).then(res => res.json()).then(data => {
    return data.username ? true : false;
  })
};
const loggedIn2 = async() => {
  return fetch('/api/username', {
    method: 'GET'
  }).then(res => res.json()).then(data => {
    return data.username;
  })
};
export { loggedIn, loggedIn2 };