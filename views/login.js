
document.getElementById('loginBtn').addEventListener('click', (e)=>{
    e.preventDefault()

    const loginEmail = document.getElementById('Lemail').value
    const loginPassword = document.getElementById('Lpassword').value
    console.log(loginEmail,loginPassword);
    axios.post('/user/login', {
        email: loginEmail,
        password: loginPassword
    }).then((response)=>{
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userName', response.data.userName);
        localStorage.setItem('userId', response.data.userId);        
        alert(`hi ${response.data.userName} welcome to Sandesh`)
         window.location.href = '/sandesh.html';

    }).catch(err=>console.log(err))

})

document.getElementById('forgotBtn').addEventListener('click',(e)=>{
    e.preventDefault()
    window.location.href = '/ForgotPassword.html'
})
