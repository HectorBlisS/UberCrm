var express = require('express');
var router = express.Router();
const Course = require('../models/Course');
const User = require('../models/User');
//const uploads = require('multer')({dest: './public/uploads'}).single('file');
const uploads = require('../helpers/cloudinary');
//mail
const sendMail = require('../helpers/mailer');

function isAuth(req,res,next){
  if(!req.isAuthenticated()) return res.redirect('/auth/login?next=/select');
  return next();
}

router.post('/reserva', uploads, (req,res,next)=>{
  if(!req.file) return res.redirect('/auth/profile');
  //req.user.paymentPic = '/uploads/' + req.file.filename;
  req.user.paymentPic = req.file.url;
  req.user.status = "SENT";
  User.findByIdAndUpdate(req.user._id,req.user)
  .then(user=>{
    //email
    sendMail(user.email, "Estamos revisando tu pago", "Maravilloso, estas a solo unas horas de ser un Ironhacker, solo debemos revisar tu comporbante de pago y nos comunicaremos contigo para felicitarte por ser parte! =D")
    //email
    res.redirect('/auth/profile')
  })
  .catch(e=>next(e));
});

router.post('/select', isAuth, (req,res, next)=>{
  req.user.selectedCourse = req.body.courseId;
  User.findByIdAndUpdate(req.user._id, req.user)
  .then(user=>{
    //email
    sendMail(user.email, "Curso Seleccionado", `Muy bien haz seleccionado un curso para aplicar tu beca, ahora solo debes realizar el deposito de apartado, revisa tu perfil para mas detalles. ;)`)
    //email
    res.redirect('/auth/profile');
  })
  .catch(e=>next(e))
})

/* courses for users to choose listing. */
router.get('/select', isAuth, function(req, res, next) {
  if(req.user.selectedCourse) return res.redirect('/auth/profile');
  Course.find({active:true})
  .then(courses=>{
    res.render('list', {courses});
  })
  .catch(e=>next(e));
});

module.exports = router;
