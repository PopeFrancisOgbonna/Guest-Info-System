const guests = (req, res, db) =>{
    db.select('name','email','phone','whom_to_see as Whom To See','purpose_of_visit as Purpose Of Visit','arrival_time as Arrival Time','departure_time as Departure Time','date_visited as Date')
        .from('guest')
        .then(user =>{
            if(user.length){
                res.status(200).json(user);
            }else{
                res.status(400).send('Error getting users')
            }
        })
        .catch(err =>console.log(err));
}

const search = (req, res, db) =>{
    const {name} = req.params;
    if(name){
        db.select('name','email','phone','whom_to_see as Whom To See','purpose_of_visit as Purpose Of Visit','arrival_time as Arrival Time','departure_time as Departure Time','date_visited as Date')
        .from('guest')
        .where('name',name)
        .then(user =>{
            console.log(user)
            if(user.length){
                res.status(200).json(user);
            }else{
                res.status(400).send('Error getting user!')
            }
        })
        .catch(err =>console.log(err));
    }
}

const mail = (req, res, sgMail) =>{
    const to = req.body.to;
    const subject = req.body.subject;
    const text = req.body.text;
   const msg = {
       to,
       from: {
           email:'francisogbonna24@gmail.com',
           name:'Pope Francis'},
       subject,
       text
     };
     sgMail.send(msg).then( ()=>{
         res.status(200).send('Message Sent');
     }).catch(err =>console.log(err.response.body));
}
module.exports = {
    guests:guests,
    search: search,
    mail:mail
}