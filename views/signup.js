const form = document.getElementById('signupForm');
form.addEventListener('submit', (e)=>{
    e.preventDefault()
    const userDetails = {        
        Name : document.getElementById('name').value ,
        number : document.getElementById('number').value,
        email : document.getElementById('email').value,
        password : document.getElementById('password').value
    }


    axios.post('/user/signup',userDetails )
    .then(()=>{ 
        window.location.href = '../login/login.html'
    })
    .catch(err=>console.log(err))
})