const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'bliss@ironhack.com',
      pass: 'Poweroso77' 
    }
});

function sendMail(to,subject,text){
    return transporter.sendMail({
        from: '"UBER + Ironhack 👻" <hola@ironhack.com>',
        to, 
        subject, 
        text,
        html: `
        <strong>${text}</strong>
        <p>Da click aqui para revisar los detalles:<a href="https://ubercrm.herokuapp.com/auth/profile"> Ir a mi perfil  </a>  </p>
        `
      })
      //.then(info => res.render('message', {email, subject, message, info}))
}

module.exports = sendMail;