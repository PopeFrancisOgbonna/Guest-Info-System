const guests = (req, res, db) =>{
    let query ='select name,email,phone,(whom_to_see) as "Whom To See",(purpose_of_visit) as "Purpose Of Visit",(arrival_time) as "Arrival Time",(departure_time) as "Departure Time",date(date_visited) as Date from guest';
    db.query(query, (err, result) =>{
        if(err){ 
            console.log(err)
            return res.status(404).send('Error getting Gusests');
        }
        if(result.rows.length){
            res.status(200).json(result.rows);
        }else{
            res.status(400).send('Error getting users')
        }
    })    
}

const search = (req, res, db) =>{
    var {name} = req.params;
    name = name.toLowerCase();
    if(name){
        let query ='select name,email,phone,(whom_to_see) as "Whom To See",(purpose_of_visit) as "Purpose Of Visit",(arrival_time) as "Arrival Time",(departure_time) as "Departure Time",(select DATE(date_visited)) as Date from guest where lower(name)=$1';
        db.query(query,[name], (err, result) =>{
            console.log(err)
            if(err) return res.status(404).send('Error getting Gusests');
            if(result.rows.length){
                res.status(200).json(result.rows);
            }else{
                res.status(400).send('Error getting users')
            }
        }) 
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