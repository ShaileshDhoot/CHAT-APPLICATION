const form = document.getElementById('signupForm');
form.addEventListener('submit', (e)=>{
    e.preventDefault()      
       const  Name = document.getElementById('name').value ;
       const  number = document.getElementById('number').value;
       const  email = document.getElementById('email').value;
       const  password = document.getElementById('password').value;
    


    axios.post('/user/signup',{
        name: Name,
        mobile: number,
        email: email,
        password: password
    } )
    .then(()=>{ 
        window.location.href = './index.html'
    })
    .catch(err=>console.log(err))
})