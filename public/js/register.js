
const submit = document.querySelector('#submit');


submit.addEventListener('click', (e) =>{
    e.preventDefault();

    const warning = document.querySelector('.warning');
    const name = document.querySelector('#name').value;
    const password = document.querySelector('#regPass').value;
    const confirmPassword = document.querySelector('#pass1').value;

    if(password !== confirmPassword){
        warning.innerHTML= 'Password do not match';
        warning.style.color = 'red';
    }else if(!password || !name || !confirmPassword){
        warning.innerHTML= 'Fill out all Fields.';
        warning.style.color = 'red';
    }
    else{
        warning.innerHTML ='';

        //posting to database
        let data = {
            name,
            password,
            password1:confirmPassword
        }
        console.log(process.env.DATABASE_URL);
        fetch('/register',{
            method:'post',
            headers:{'content-type':'application/json'},
            body:JSON.stringify(data)
        }).then(response =>{
            if(response.status === 200){
                console.log(response);
                warning.innerHTML='Registration was Successful';
                warning.style.color='green'
            }else{
                warning.innerHTML ='Something went Wrong. Please try again!';
                warning.style.color ='red';
            }
        }).catch(err =>console.log(err));
        
    }
})