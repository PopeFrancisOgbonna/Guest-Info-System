const register = (req, res, db) =>{
    const name = req.body.name;
    const password = req.body.password;
    const confirm = req.body.password1;
    const post ='Staff';
    if(name && password ){
            let query = 'insert into staff (name,post,password) values ($1,$2,$3)';
        if(password !== confirm){
            return res.send('Error: Password do not Match!')
        }else{
            db.query(query,[name,post,password], (err, result)=>{
                if(err) {
                    console.log(err);
                    return res.status(400).send({Error:err})}
                if(result.rowCount > 0){
                    res.status(200).send('Registration was Successfull!!');
                }else{
                    res.status(400).send('Error: Unable to Register. Try again later!');
                }
            })
        }
    }
};
const regStaff = (req, res, db) =>{
    const name = req.body.name;
    const password = req.body.password;
    const confirm = req.body.confirm;
    const post =req.body.post;
    if(name && password ){
       if(password !== confirm){
           res.status(400).send('Error: Password do not match!');
           return;
        }
        //The query inserts a record to staff
        let query = 'insert into staff (name,post,password) values ($1,$2,$3)';
        db.query(query,[name,post,password], (err, result) =>{
            if(err) return res.status(404).send({Error:'Oops! Something went wrong.'})
            if(result.rowCount > 0){
                res.status(200).send('Registrarion was Successful!!');
            }else{
                res.status(400).send('Unable to complete Operation.')
            }
        })
            
    }
}
//Guest Registration
const addGuest = (req, res, db) =>{
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const whom = req.body.whomtosee;
    const purpose = req.body.purpose;
    const arrival = req.body.arrive;
    const depart = req.body.departure;
    const date = req.body.date;
    if(name && email && phone && whom && purpose && arrival && depart && date){
        let query ='insert into guest (name,email,phone,whom_to_see,purpose_of_visit,arrival_time,departure_time,date_visited) values($1,$2,$3,$4,$5,$6,$7,$8)';
        db.query(query,[name,email,phone,whom,purpose,arrival,depart,date], (err, result) =>{
            if(err) {
                console.log('Error from query '+err)
                return res.status(400).send(err);}
            if(result.rowCount > 0){
                res.status(200).send('Registration was Successful.');
            }else{
                res.status(400).send('Error: Unable to complete action.');
            }
        })
    }
}
module.exports = {
    register:register,
    regStaff:regStaff,
    addGuest:addGuest
}