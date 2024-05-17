const login = async (email,password) => {
  try {
    const result = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/users/login',
      data: {
        email,
        password
      }
    });
    if (result.data.status == 'Success'){
      alert('Loggedin Successfully');
      window.setTimeout(() => {
        location.assign('/');
      });
    };
  } catch (error) {
    alert(error.response.data.message);
  } 
};

document.querySelector('.form').addEventListener('submit', event => {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});