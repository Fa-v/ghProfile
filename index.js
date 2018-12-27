(function() {
  /**@namespace profile
   * @this Window
   */
  const profile = {};
  const searchBox = document.forms['searchBar'];
  const searchInput = document.getElementById('submit-input');
  const container = document.querySelector('.container');
  let user;

  /**
   * Fetches user's public profile from GitHub 'users' api
   * @param {String} url
   * @returns {Void}
   * @this Window
   */
  profile.getUserData = url => {
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error fetching user data');
        }
      })
      .then(data => profile.renderProfile(data))
      .catch(error => console.log(error));
  };

  /**
   * Fetches public repositories a specific user in from GitHub api
   * @param {String} url
   * @returns {Void}
   * @this Window
   */
  profile.fetchRepos = url => {
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error fetching user data');
        }
      })
      .then(data => profile.searchForCommitsUrl(data))
      .catch(error => console.log(error));
  };

  /**
   * Fetches commits in public repositories from a specific user GitHub api
   * @param {String} url
   * @returns {Void}
   * @this Window
   */
  profile.fetchCommits = url => {
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error fetching user data');
        }
      })
      .then(data => profile.searchForEmail(data))
      .catch(error => console.log(error));
  };

  /**
   * Sets parameters in the Url
   * @param {String} user the GitHub user introduced by the user
   * @returns {String} the final url
   * @this Window
   */
  profile.composeUrl = user => {
    const clientID = '';
    const secret = '';
    const baseUrl = 'https://api.github.com/users/';
    const composedUrl = `${baseUrl}${user}?client_id=${clientID}&client_secret=${secret}`;
    return composedUrl;
  };

  /**
   * Adds the submit event to the form and gets the input value
   * @param {String} user the GitHub user introduced by the user
   * @returns {Void}
   * @this Window
   */
  profile.setUpEventListener = () => {
    searchBox.addEventListener('submit', event => {
      event.preventDefault();
      user = searchInput.value;
      let url = profile.composeUrl(user);
      profile.getUserData(url);
    });
  };

  profile.searchForCommitsUrl = data => {
    let commitUrl = data.map(repo => {
      let url = repo.commits_url;
      return (url = url.slice(0, -6));
    });
    profile.fetchCommits(commitUrl[0]);
  };

  profile.searchForEmail = data => {
    const emailNode = document.getElementById('email');
    let email;
    data.map(item => {
      email = item.commit.author.email;
      console.log(email);
      return email;
    });
    let text = `Email: ${email}`;
    emailNode.innerText = text;
  };

  /**
   * Processes the response from the fetch request and shows the user profile info
   * @param {Object} user the profile for the GitHub user introduced by the user
   * @returns {Void}
   * @this Window
   */
  profile.renderProfile = data => {
    const card = document.querySelector('.card');
    card.innerHTML = '';
    if (data.email === null) {
      const clientID = '';
      const secret = '';
      const baseUrl = 'https://api.github.com/users/';
      const composedUrl = `${baseUrl}${user}/repos?client_id=${clientID}&client_secret=${secret}`;
      profile.fetchRepos(composedUrl);
    }

    let template = `
      <h4>Name: ${data.name}</h4>
      <p>GitHub user: ${data.login}</p>
      <p id="email">Email: ${data.email}</p>
      <p>Bio: ${data.bio}</p>
      <p>Repos: ${data.public_repos}</p>
      <p>Followers: ${data.followers}</p>
      <p>Following: ${data.following}</p>
    `;
    card.insertAdjacentHTML('beforeend', template);
    container.append(card);
  };

  /**
   * Adds event listener when the app is initialized
   * @param {Object} user the profile for the github user introduced by the user
   * @returns {Void}
   * @this Window
   */
  profile.init = () => {
    profile.setUpEventListener();
  };

  profile.init();
  return profile;
})();
