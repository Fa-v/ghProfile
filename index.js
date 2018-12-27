(function() {
  const profile = {};
  const baseUrl = 'https://api.github.com/users/';
  let user = 'Fa-v';
  const composeUrl = `${baseUrl}${user}?client_id=${clientID}&client_secret=${secr}`;
  console.log(composeUrl);

  profile.getUserData = url =>
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something happened');
        }
      })
      .then(data => console.log(data))
      .catch(error => console.log(error));

  profile.init = () => {
    profile.getUserData(composeUrl);
  };

  profile.init();
  return profile;
})();
