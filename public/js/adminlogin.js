const send = document.querySelector('#adminLog');
const warning = document.querySelector('#adminWarn');

send.addEventListener('click',(e) =>{
    e.preventDefault();
    const name = document.querySelector('#name');
    const password = document.querySelector('#password');

    if((name.value && password.value) !== ''){
        let data ={
            name:name.value,
            password:password.value
        }
        fetch('/admin',{
            method:'post',
            headers:{"content-type":"application/json"},
            body:JSON.stringify(data)
        }).then(response =>{
            if(response.status === 400){
                warning.innerHTML = 'Access Denied!'
                warning.style.color = 'red';
            }else{
                warning.innerHTML = '';
                fetch('/members',{
                    method:'get',
                    headers:{"content-type":"application/json"}
                }).then(member =>{ response.json()
                    console.log(member);
                })
                .catch(err =>console.log(err));

                fetch('/visitors',{
                    method:'get',
                    headers:{"content-type":"application/json"}
                }).then(visitor =>{ response.json()
                    console.log(visitor);
                })
                .catch(err =>console.log(err));
                location.assign('/dashboard')
            }
        })
        .catch(err =>console.log(err));
    }
})