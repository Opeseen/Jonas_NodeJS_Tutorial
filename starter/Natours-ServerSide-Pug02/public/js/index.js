import '@babel/polyfill';
import {login} from './login';

document.querySelector('.form').addEventListener('submit', event => {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});