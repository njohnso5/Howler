import api from './APIClient.js';

let firstname = document.querySelector('#firstname');
let lastname = document.querySelector('#lastname');
let username = document.querySelector('#username');
let password = document.querySelector('#password');
let loginButton = document.querySelector('#login');
let registerbutton = document.querySelector('#register');
let errortext = document.querySelector('#errortext');

loginButton.addEventListener('click', e => {
    api.logIn(username.value, password.value).then(res => {
        console.log(res);
        document.location = '/';
    }).catch((err) => {
        errortext.hidden = false;
        console.log("Authentication failed.  Please try again");
    });
})

registerbutton.addEventListener('click', e => {
    document.location = '/register';
})