(function() {
  /**@namespace profile
   * @this Window
   */
  const profile = {};
  const searchBox = document.forms['searchBar'];
  const searchInput = document.getElementById('submit-input');
  const container = document.querySelector('.container');
  const card = document.querySelector('.card');
  const baseUrl = 'https://api.github.com/users/';
  const clientID = '';
  const secret = '';
  let user;

  /**
   * Fetches user's public profile from GitHub 'users' api. If, there is not a
   * valid email address in data, look for it in the repositories
   * @param {String} url
   * @returns {Void}
   * @this Window
   */
  profile.getUserData = url => {
    profile.showLoader();
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error fetching user data');
        }
      })
      .then(data => {
        if (profile.validateEmail(data)) {
          return profile.renderProfile(data);
        }

        const url = profile.composeReposUrl(data.login);
        profile.fetchRepos(url, data);
      })
      .catch(error => console.log(error));
  };

  /**
   * Fetches for a valid email address in user's public repositories and commits
   * from GitHub api
   * @param {String} url
   * @returns {Void}
   * @this Window
   */
  profile.fetchRepos = (url, initialUserData) => {
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error fetching user data');
        }
      })
      .then(data => {
        const commitsUrl = profile.searchForCommitsUrl(data);
        return profile.fetchCommits(commitsUrl);
      })
      .then(data => profile.searchForEmail(data))
      .then(email => profile.renderProfile({ ...initialUserData, email }))
      .catch(error => console.log(error));
  };

  /**
   * Fetches commits in public repositories from a specific user GitHub api
   * @param {String} url
   * @returns {Void}
   * @this Window
   */
  profile.fetchCommits = url => {
    return fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error fetching user data');
        }
      })
      .catch(error => console.log(error));
  };

  /**
   * Sets parameters in the Url
   * @param {String} user the GitHub user introduced by the user
   * @returns {String} the final url to fetch a user
   * @this Window
   */
  profile.composeUserUrl = user => {
    const composedUrl = `${baseUrl}${user}?client_id=${clientID}&client_secret=${secret}`;
    return composedUrl;
  };

  /**
   * Sets parameters in the Url
   * @param {String} user the GitHub user introduced by the user
   * @returns {String} the final url to fetch a user's repositories
   * @this Window
   */
  profile.composeReposUrl = user => {
    const composedUrl = `${baseUrl}${user}/repos?client_id=${clientID}&client_secret=${secret}`;
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
      let url = profile.composeUserUrl(user);
      profile.getUserData(url);
    });
  };

  /**
   * Search in the data for the commits url
   * @param {Object} data user's repositories
   * @returns {String} url for the commits in user's repositories
   * @this Window
   */
  profile.searchForCommitsUrl = data => {
    let commitUrl = data.map(repo => {
      let url = repo.commits_url;
      return (url = url.slice(0, -6));
    });

    return commitUrl[0];
  };

  /**
   * Search in the email in the user's commits and shows it in the DOM
   * @param {Object} data user's commits
   * @returns {String} email user's email
   * @this Window
   */
  profile.searchForEmail = data => {
    let validEmails = data.filter(item => {
      return profile.validateEmail(item.commit.author);
    });
    const getEmail = list => list[0].commit.author.email;

    return validEmails.length ? getEmail(validEmails) : '';
  };

  profile.validateEmail = data => {
    let ex = /([^0-9]\+|[[a-z]+)([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@[^users][^noreply][a-z]*[\.]*([com]*|[edu]|[org])?/i;
    const isValid = ex.test(data.email) && data.email !== null;

    return isValid;
  };

  /**
   * Processes the response from the fetch request and shows the user profile info
   * @param {Object} user the profile for the GitHub user introduced by the user
   * @returns {Void}
   * @this Window
   */
  profile.renderProfile = data => {
    card.innerHTML = '';

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
   * Shows animation while fetching data
   * @returns {Void}
   */
  profile.showLoader = () => {
    card.innerHTML = '';
    const loader = `<div id="pageLoader" class="lds-ellipsis">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>`;
    card.insertAdjacentHTML('beforeend', loader);
  };

  /**
   * Hides animation when we have the data to show
   * @returns {Void}
   */
  profile.hideSpinner = () => {
    spinner.removeAttribute('class');
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
