const loggedIn = async() => {
  return fetch('/api/username', {
    method: 'GET'
  }).then(res => res.json()).then(data => {
    return data.username ? true : false;
  })
};
export { loggedIn };