const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const PORT = process.env.PORT;
const pg = require('pg');
const knex = require('knex');
const router = require('./controlers/route');
const registerHandle = require('./models/registerHandle');
const loginHandle = require('./models/loginHandle');
const viewGuest = require('./models/handleGuest');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;
const db = new pg.Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
    ssl: isProduction,
  });
  db.on('connect', () => {
    console.log('Teamwork Database connected successfully!');
  });
// const db = new Client({
//     connectionString: 'postgres://hbniqsbyvfwzqh:dd633e95a8a56e83ded7ebb139137033984a9c744f02b8d4a3c30be1209ca84a@ec2-52-20-248-222.compute-1.amazonaws.com:5432/d4civi53hooh6m',
//     ssl: {
//         rejectUnauthorized: false
//       }
// });

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());
app.use('/',router);

//image file (static files)
app.use('/img',express.static(__dirname + 'public/img'));
app.use('/js',express.static(__dirname + 'public/js'))
// const head = require(__dirname + 'public/js/head');

//Routes

let visitors;
let members;
app.get('/dashboard', (req, res) =>{
    res.render('admin')
})
let r;
router.get('/info',(req,res)=>{
    res.render('info',{name:r.name});
})
// app.get('*',(req, res) =>{
//     res.status(404).render('errors');
// })
// Port request
app.post('/register',(req, res)=>{
    console.log(process.env.DATABASE_URL);
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
    loginHandle.login(req, res, db);
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
    db('staff').count('name as id')
    .then(member =>{
        members = (member);
        res.status(200).json(member);
    })
    .catch(err =>{
        console.log(members)
        console.log(err);
    })
});
//Get Number of visitors 

app.get('/visitors', (req, res) =>{
    db('guest').count('name as id')
    .then(member =>{
        visitors = member;
        res.status(200).json(member);
    })
    .catch(err =>{
        console.log(visitors)
        console.log(err);
    })
})

app.listen(PORT || '5001',()=>{console.log(`Server started!${PORT}`)});

