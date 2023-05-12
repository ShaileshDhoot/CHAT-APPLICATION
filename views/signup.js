const form = document.getElementById('signupForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const number = document.getElementById('number').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (!password) {
    return alert('Password is required');
  }
  if (!name) {
    return alert('Name is required');
  }
  if (!number) {
    return alert('Number is required');
  }
  if (!email) {
    return alert('Email is required');
  }

  axios
    .post('/user/signup', {
      name: name,
      mobile: number,
      email: email,
      password: password,
    })
    .then((res) => {
      if (res.status === 409) {
        alert('User already exists, Please Login');
      } else {
        alert('Successfully signed up');
        form.reset() 
        window.location.href = '../login/login.html';
      }
    })
    .catch((err) => {
      console.log(err);
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert('Server error');
      }
    });
});
