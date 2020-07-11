const express = require('express');
const mysql = require('mysql');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const nodeMailer = require('nodemailer');
const { response } = require('express');
const PORT = process.env.PORT;

const app = express();
const conn = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'guestInfo'
});

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//image file (static files)
app.use('/img',express.static(__dirname + 'public/img'));
app.use('/js',express.static(__dirname + 'public/js'))
// const head = require(__dirname + 'public/js/head');

//Routes
app.get('/',(req,res)=>{
    res.render('index',{text:'Relaxation and Comfort',company:'Xpress Dreams Technology',pass:'hello' });
});
app.get('/about',(req, res)=>{
    res.render('about');
});
app.get('/contact',(req, res)=>{
    res.render('contact');
});
app.get('/service',(req, res)=>{
    res.render('service');
});
app.get('/register',(req,res)=>{
    res.render('register')
});
app.get('/login',(req,res)=>{
    res.render('login')
});
let r ;
app.get('/info',(req,res)=>{
    res.render('info',{name:r[0].Name});
})
// Port request
app.post('/register',(req, res)=>{
    const name = req.body.name;
    const password = req.body.password;
    const confirm = req.body.password1;
    const post ='Staff';
    if(name && password ){
            // let query = 'insert into user (name,password) values (?,?)';
        if(password !== confirm){
            return res.send('Error: Password do not Match!')
        }else{
            conn.query('insert into staff (Name,Post,Password) values (?,?,?)',[name, post, password],(error,result)=>{
                console.log(result);
                if(result){
                res.status(200).send('Registration was Successfull!!');
                }else{
                    console.log(error);
                }
            });
        }
    }
});
//Staff Registeration by Admin
app.post('/addstaff',(req, res)=>{
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const whom = req.body.whomtosee;
    const purpose = req.body.purpose;
    const arrival = req.body.arrive;
    const depart = req.body.departure;
    const date = req.body.date;
    if(name && email && phone && whom && purpose && arrival && depart && date){
        let query = 'insert into guest (Name,Email,Phone,Whom_To_See,Purpose_Of_Visit,Arrival_Time,Depature_Time,Date_Visited) values (?,?,?,?,?,?,?,?)';
        
        conn.query(query,[name, email, phone, whom,purpose,arrival,depart,date],(error,result)=>{
            console.log(result);
            if(result){
            res.status(200).send('Registration was Successfull!!');
            }else{
                console.log(error);
            }
        });
    }
});
var table;
//login verification
app.post('/login',(req, res)=>{
    const name = req.body.name;
    const password = req.body.password;
    if(name && password){
        conn.query('select * from staff where name=? and password=?',[name,password],(error, result,fields)=>{
           if(error) throw error; 
           console.log(result);
           if(result.length){
                r = result;
               table = result;
                res.redirect(200,'info');
           }else{
               res.send('Incorrect name and password!');
           }
        }); 
    }else{
        res.send('Please fillout all Fields');
    }
});
//Get all Guest from Database
app.get('/users',(req, res)=>{
    let query ="select Name,Email,Phone,Whom_To_See as 'Whom To See',Purpose_Of_Visit as 'Purpose of Visit',Arrival_Time as'Arrival Time',Depature_Time as 'Departure Time', (select DATE_FORMAT(Date_Visited,'%D-%M-%Y')) as 'Date' from guest";
    conn.query(query,(err, result)=>{
        console.log(result);
        if(err){return res.send(err);}
        if(result.length){
            res.status(200).json(result);
        }else{
            res.status(404).send('Error getting users');
        }
    })
})
//Get a specific Guest's Information
app.get('/users/:name',(req, res)=>{
    const {name} = req.params;
    if(name){
        conn.query('select * from guest where name=?',[name],(err, result)=>{
            if(result.length){
                console.log(result)
                res.status(200).json(result);
            }else{
                res.status(400).json('')
            }
        })
    }
});
//Sending Mail to guests'
app.post('/mail',(req, res) =>{
    const to = req.body.to;
    const subject = req.body.subject;
    const text = req.body.text;

    var mailing = {
        from: "xpressdreams.ng@gmail.com",
        to,
        subject,
        text
    }
    console.log(mailing);
    const transporter = nodeMailer.createTransport({
        service:'gmail',
        auth:{
            user:'xpressdreams.ng@gmail.com',
            pass:'<xpressdreams/>'
        }
    });
    transporter.sendMail(mailing, (err, info) =>{
       
        if(err){
            console.log('Error '+ err)
        }else{
            console.log(info.response);
        
        }
    })
})

app.listen(PORT || '5001',()=>{console.log(`Server started!`)});
;
