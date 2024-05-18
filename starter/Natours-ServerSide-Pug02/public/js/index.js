import '@babel/polyfill';
import {login, logout} from './login';
import {displayMap} from './mapbox';

// DOM ELEMENT
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');
const logOutButton = document.querySelector('.nav__el--logout');

// DELEGATION
if(mapBox){
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
};

if (loginForm){
  loginForm.addEventListener('submit', event => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    event.preventDefault();
    login(email, password);
  });
};

if(logOutButton) {logOutButton.addEventListener('click', logout)}
