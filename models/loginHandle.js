const adminlogin = (req, res, db) =>{
    name = req.body.name;
    password = req.body.password;

    if(name && password){
        let query ='select * from staff where name =$1 and password = $2';
        db.query(query,[name,password], (err, result) =>{
            if(err) {
                console.log(err);
                return res.status(400).send('Invalid login details!');
            }
            if(result.rows.length){
                let post = result.rows[0].post; 
                if(post.toLowerCase() === 'admin'){
                    res.status(200).redirect('dashboard')
                }else{
                    res.status(400).json('Access Denied!')
                }
            }else{
                res.status(400).send('Incorrect Password and Username!');
            }
        })
    }
}

module.exports = {
    adminlogin:adminlogin
}