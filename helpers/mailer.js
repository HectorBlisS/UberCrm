const nodemailer = require('nodemailer');
const hbs = require('hbs');
const fs = require('fs');

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
});
const accountCreated = hbs.compile(fs.readFileSync((__dirname, './views/mail/accountCreated.hbs'), 'utf8'));
const courseSelected = hbs.compile(fs.readFileSync((__dirname, './views/mail/courseSelected.hbs'), 'utf8'));
const payUploaded = hbs.compile(fs.readFileSync((__dirname, './views/mail/payUploaded.hbs'), 'utf8'));


exports.accountCreatedMail = function(to,subject,text,name){
    return transporter.sendMail({
        from: '"UBER + Ironhack 👻" <hola@ironhack.com>',
        to, 
        subject, 
        text,
        html: accountCreated({name})
        // html: `
        // <strong>${text}</strong>
        // <p>Da click aqui para revisar los detalles:<a href="https://ubercrm.herokuapp.com/auth/profile"> Ir a mi perfil  </a>  </p>
        // `
      })
      //.then(info => res.render('message', {email, subject, message, info}))
}

exports.courseSelected = function(to,subject,text,name){
    return transporter.sendMail({
        from: '"UBER + Ironhack 👻" <hola@ironhack.com>',
        to, 
        subject, 
        text,
        html: courseSelected({name})
        // html: `
        // <strong>${text}</strong>
        // <p>Da click aqui para revisar los detalles:<a href="https://ubercrm.herokuapp.com/auth/profile"> Ir a mi perfil  </a>  </p>
        // `
      })
      //.then(info => res.render('message', {email, subject, message, info}))
}

exports.payUploaded = function(to,subject,text,name){
    return transporter.sendMail({
        from: '"UBER + Ironhack 👻" <hola@ironhack.com>',
        to, 
        subject, 
        text,
        html: payUploaded({name})
        // html: `
        // <strong>${text}</strong>
        // <p>Da click aqui para revisar los detalles:<a href="https://ubercrm.herokuapp.com/auth/profile"> Ir a mi perfil  </a>  </p>
        // `
      })
      //.then(info => res.render('message', {email, subject, message, info}))
}



