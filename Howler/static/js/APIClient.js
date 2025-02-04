import HTTPClient from "./HTTPClient.js";

const API_BASE = 'api';

export default {

  getCurrentUser: () => {
    return HTTPClient.get(API_BASE+'/users/current');
  },

  logIn: (username, password) => {
    let data = {
      username: username,
      password: password
    }
    console.log("Sending to HTTP Client");
    return HTTPClient.post(API_BASE+'/users/login', data);
  },

  logOut: () => {
    return HTTPClient.post(API_BASE+'/users/logout', {});
  },

  register: (firstname, lastname, username, password) => {
    let data = {
      first_name: firstname,
      last_name: lastname,
      username: username,
      password: password
    }
    return HTTPClient.post(API_BASE+'/users/register', data);
  },

  getUsersFollowed: (id) => {
    return HTTPClient.get(API_BASE+`/follows/${id}`);
  },

  getHowlsByUser: (id) => {
    return HTTPClient.get(API_BASE+`/howls/${id}`);
  },

  getUser: (id) => {
    return HTTPClient.get(API_BASE+`/users/${id}`);
  },

  getAllHowlsFollowed: () => {
    return HTTPClient.get(API_BASE+`/howls/followed`);
  },

  addToFollowed: (id) => {
    let data = {
      id: id,
    }
    return HTTPClient.post(API_BASE+`/follows`, data);
  },

  removeFromFollowed: (id) => {
    return HTTPClient.delete(API_BASE+`/follows/${id}`);
  },

  addHowl: (howl) => {
    return HTTPClient.post(API_BASE+'/howls', howl);
  }

//   logOut: () => {
//     return HTTPClient.post(API_BASE+'/users/logout', {});
//   }
};