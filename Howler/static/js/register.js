import api from './APIClient.js';

let firstname = document.querySelector('#firstname');
let lastname = document.querySelector('#lastname');
let username = document.querySelector('#username');
let password = document.querySelector('#password');
let loginButton = document.querySelector('button');
let errortext = document.querySelector('#errortext');

loginButton.addEventListener('click', e => {
    api.register(firstname.value, lastname.value, username.value, password.value).then(userData => {
        document.location = '/';
    }).catch((err) => {
        errortext.hidden = false;
        console.log("Authentication failed.  Please try again");
    });
})