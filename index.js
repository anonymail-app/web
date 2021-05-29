const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const ejs = require('ejs');
require('dotenv/config');

const app = express();

app.use('/public', express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('compose');
});

app.post('/send', (req, res) => {

    const transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.ACCOUNT,
    pass: process.env.PASSWORD
  }
}));

const mailOptions = {
  from: '"Anonymail" node.anonymail@gmail.com',
  to: req.body.to,
  cc: req.body.cc,
  subject: req.body.subject + ' - Anonymail',
  text: 'Your mail client is not compatible with web markup!',
  html: req.body.message +  '\nThis message was was sent using Anonymail.'
};

res.render('sent')

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});  
  
  });

app.listen(3000, () => console.log('Server started...'));
