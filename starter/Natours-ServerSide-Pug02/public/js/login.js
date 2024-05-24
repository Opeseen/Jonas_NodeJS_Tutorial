import axios from 'axios';
import {showAlert} from './alert';

export const login = async (email,password) => {
  try {
    const result = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/users/login',
      data: {
        email,
        password
      }
    });
    if (result.data.status === 'Success'){
      showAlert('success','LoggedIn Successfully');
      window.setTimeout(() => {
        location.assign('/');
      },1000);
    };
  } catch (error) {
    showAlert('error',error.response.data.message);
  }
 
};

export const logout = async() => {
  try {
    const result = await axios({
      method: 'GET',
      url: 'http://localhost:3000/api/v1/users/logout'
    });
    if(result.data.status === 'Success') location.reload(true) // This will reload from the server not from the browser cache
  } catch (error) {
    showAlert('error', 'Error logging out!')
  }
};