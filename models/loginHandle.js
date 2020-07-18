const login = (req, res, db) =>{
    const name = req.body.name;
    const password = req.body.password;
    db('staff').where({
        name,
        password
    }).then(response =>{
        if(response.length){
            r=response[0];
            res.status(200).redirect('info');
        }else{
            res.status(400).send('Incorrect Password and Username!');
        }
    }).catch(err =>console.log(err));
}
const adminlogin = (req, res, db) =>{
    name = req.body.name;
    password = req.body.password;

    if(name && password){
        db('staff').where({
            name,
            password
        })
        .then( user =>{
            if(user.length){
                let post = user[0].post
                if(post.toLowerCase() === 'admin'){
                    res.status(200).redirect('dashboard')
                }else{
                    res.status(400).json('Access Denied!')
                }
            }else{
                res.status(400).render('error');
            }
        })
        .catch(err =>console.log(err));
    }else{
        res.status(404).render('Errors');
    }
}

module.exports = {
    login:login,
    adminlogin:adminlogin
}