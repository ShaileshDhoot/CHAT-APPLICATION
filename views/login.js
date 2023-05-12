
document.getElementById('loginBtn').addEventListener('click', (e)=>{
    e.preventDefault()

    const loginEmail = document.getElementById('Lemail').value
    const loginPassword = document.getElementById('Lpassword')

    axios.post('/user/login', {
        email: loginEmail,
        password: loginPassword
    }).then(()=>{
        localStorage.setItem('token', response.data.token);
        alert('welcome to Sandesh')
        window.location.href = '/sandesh.html';

    }).catch(err=>console.log(err))

})

document.getElementById('forgotBtn').addEventListener('click',(e)=>{
    e.preventDefault()
    window.location.href = '/ForgotPassword.html'
})
