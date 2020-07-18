const register = (req, res, db) =>{
    const name = req.body.name;
    const password = req.body.password;
    const confirm = req.body.password1;
    const post ='Staff';
    if(name && password ){
            // let query = 'insert into user (name,password) values (?,?)';
        if(password !== confirm){
            return res.send('Error: Password do not Match!')
        }else{
            db('staff')
                .returning('id')
                .insert({name,post,password})
                .then(staff =>{
                    if(staff.length){
                        res.status(200).send('Registration was Successfull!!');
                    }else{
                        res.status(400).send('Error: Unable to Register. Try again later!');
                    }
                })
                .catch(err =>console.log(err));
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
           console.log('pass '+password);
           console.log(confirm)
           res.status(400).send('Error: Password do not match!');
           return;
        }
        //The query inserts a record and returns the ID of it
        db.insert([{name,post,password}],['id']).into('staff')
        .then(person =>{
            console.log(person);
            if(person.length){
                res.status(200).send('Registrarion was Successful!!');
            }
        })
        .catch(error =>console.log(error));
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
        db('guest')
            .returning('id')
            .insert({name,email,phone,whom_to_see:whom,purpose_of_visit:purpose,arrival_time:arrival,departure_time:depart,date_visited:date})
            .then(guest =>{
                if(guest.length){
                    res.status(200).send('Registration was Successful.');
                }else{
                    res.status(400).send('Error: Unable to complete action.');
                }
            })
            .catch(err =>console.log(err));
    }
}
module.exports = {
    register:register,
    regStaff:regStaff,
    addGuest:addGuest
}