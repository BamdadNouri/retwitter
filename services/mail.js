const nodemailer = require('nodemailer')
const config = require('../config/config')


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.mail.address,
      pass: config.mail.pass
    }
  })

function mailService(type, data){

var mailOptions = {
        from: config.mail.address
    }   

switch(type){

    case 'userWelcome':
        mailOptions['to'] = data.email
        mailOptions['subject'] = 'Welcome To reTwitter.'
        mailOptions['html'] = `Hey...?`
        break;

    case 'custom':
        mailOptions['to'] = data.email
        mailOptions['subject'] = data.subject
        mailOptions['html'] = data.mailBody
        break;
}



    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error)
        }else{
            console.log(info.response)
        }
    })
}

module.exports = mailService