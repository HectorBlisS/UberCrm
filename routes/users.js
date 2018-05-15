var express = require('express');
var router = express.Router();
const Course = require('../models/Course');
const User = require('../models/User');
//const uploads = require('multer')({dest: './public/uploads'}).single('file');
const uploads = require('../helpers/cloudinary');
//mail
const courseSelected = require('../helpers/mailer').courseSelected;
const payUploaded = require('../helpers/mailer').payUploaded;
const notifyAdmin = require('../helpers/mailer').notifyAdmin;

function isAuth(req,res,next){
  if(!req.isAuthenticated()) return res.redirect('/auth/login?next=/select');
  return next();
}

router.get('/politics', (req,res)=>{
  res.render('politics');
});

router.post('/reserva', uploads, (req,res,next)=>{
  if(!req.file) return res.redirect('/auth/profile');
  //req.user.paymentPic = '/uploads/' + req.file.filename;
  req.user.paymentPic = req.file.url;
  req.user.status = "SENT";
  // Course.findById(req.user.selectedCourse)
  // .then(cou=>{
  //   if(!cou.available) return res.redirect('/select');
  // })
  // .then(r=>console.log(r)) //aqui ando!!!
  //.catch(e=>next(e));
  Course.findByIdAndUpdate(req.user.selectedCourse, {$push:{enrolled:req.user._id}})
  User.findByIdAndUpdate(req.user._id,req.user)
  .populate('app')
  .then(user=>{
    //email
    payUploaded(user.email, "Estamos revisando tu pago", "Maravilloso, estas a solo unas horas de ser un Ironhacker, solo debemos revisar tu comporbante de pago y nos comunicaremos contigo para felicitarte por ser parte! =D", user.app.name)
    notifyAdmin(user);
    //email
    res.redirect('/auth/profile')
  })
  .catch(e=>next(e));
});

router.post('/select', isAuth, (req,res, next)=>{
  req.user.selectedCourse = req.body.courseId;
  //checar cupo
  Course.findById(req.body.courseId)
  .then(course=>{
    if(!course.available) return res.redirect('/select');
    return User.findByIdAndUpdate(req.user._id, req.user).populate('app');
  })
  // .populate('app')
  .then(user=>{
    //email
    courseSelected(user.email, "Curso Seleccionado", `Muy bien haz seleccionado un curso para aplicar tu beca, ahora solo debes realizar el deposito de apartado, revisa tu perfil para mas detalles. ;)`, user.app.name)
    //email
    res.redirect('/auth/profile');
  })
  .catch(e=>next(e))
})

/* courses for users to choose listing. */
router.get('/select', isAuth, function(req, res, next) {
  if(req.user.selectedCourse) return res.redirect('/auth/profile');
  Course.find({active:true})
  .sort('date')
  .then(courses=>{
    
    res.render('list', {courses, test:false});
  })
  .catch(e=>next(e));
});

module.exports = router;
