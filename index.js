const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const PORT = process.env.PORT || 5000;
const pg = require('pg');
const router = require('./controlers/route');
const registerHandle = require('./models/registerHandle');
const loginHandle = require('./models/loginHandle');
const viewGuest = require('./models/handleGuest');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;
const db = new pg.Pool({
    connectionString:isProduction ? process.env.DATABASE_URL : connectionString,
    ssl:isProduction?{rejectUnauthorized: false} :false
  });
  db.on('connect', () => {
    console.log('Teamwork Database connected successfully!');
  });

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());
app.use('/',router);

//image file (static files)
app.use('/img',express.static(__dirname + 'public/img'));
app.use('/js',express.static(__dirname + 'public/js'));

//Routes
let user;
router.get('/info',(req,res)=>{
    res.render('info',{name:user.name});
})
let visitors;
let members;
app.get('/dashboard', (req, res) =>{
    res.render('admin')
})

// app.get('*',(req, res) =>{
//     res.status(404).render('errors');
// })
// Port request
app.post('/register',(req, res)=>{
   registerHandle.register(req,res,db)
});
app.post('/addstaff',(req, res)=>{
   registerHandle.regStaff(req, res, db);
});
// Guest Registration by Staff Using Postgress Database
app.post('/addguest',(req, res)=>{
    registerHandle.addGuest(req, res, db);
});
var table;
//Postgress database  
app.post('/login', (req, res) =>{
    
    const name = req.body.name;
    const password = req.body.password;
    let query ='select * from staff where name =$1 and password = $2';
    db.query(query,[name,password], (err, result) =>{
        if(err) {
            console.log(err);
            return res.status(400).send('Invalid login details!');
        }
        if(result.rows.length){
            user = result.rows[0];
        res.status(200).redirect('/info');
        }else{
            res.status(400).send('Incorrect Password and Username!');
        }
    })
   
})
//Get all Guest from Database
app.get('/users',(req, res)=>{
    viewGuest.guests(req, res, db);
})
//Get a specific Guest's Information
app.get('/users/:name',(req, res)=>{
   viewGuest.search(req, res, db);
});
//Sending Mail to guests'
app.post('/mail',(req, res) =>{
    viewGuest.mail(req, res, sgMail);
});
//Admin login
app.post('/admin', (req, res) =>{
    loginHandle.adminlogin(req, res, db);
});
//Get Number of staff/members
app.get('/members',(req, res) =>{
    db.query('select count(*) from staff', (error, result) =>{
        if(error) return res.status(400).send('User not Found.');
        res.status(200).json(result.rows);
    })
});
//Get Number of visitors 

app.get('/visitors', (req, res) =>{
    db.query('select count(*) from guest', (error, result) =>{
        if(error) return res.status(400).send('User not Found.');
        res.status(200).json(result.rows);
    })
})

app.listen(PORT,()=>{console.log(`Server started!${PORT}`)});

