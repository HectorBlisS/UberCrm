const router = require('express').Router();
const Course = require('../models/Course');
const moment = require('moment');

function isAdmin(req,res, next){
    if(!req.isAuthenticated()) return res.redirect('/auth/login');
    if(req.user.role !== "ADMIN") return res.redirect('/auth/profile');
    return next();
}

router.get('/courses/:id', isAdmin, (req,res,next)=>{
    Course.findById(req.params.id)
    .then(course=>{
        course.fecha = moment(course.date).format('YYYY-MM-DD'); 
        res.render('admin/courseDetail', {course});
    })
    .catch(e=>next(e));
})

router.post('/courses/:id', isAdmin, (req,res, next)=>{
    Course.findByIdAndUpdate(req.params.id, req.body)
    .then(course=>{
        res.redirect('/admin/courses');
    })
    .catch(e=>next(e));
})

router.post('/courses', isAdmin, (req,res, next)=>{
    req.body.publisher = req.user._id;
    Course.create(req.body)
    .then(course=>{
        res.redirect('/admin/courses');
    })
    .catch(e=>next(e));
})

router.get('/courses', isAdmin, (req,res,next)=>{
    Course.find()
    .then(courses=>{
        res.render('admin/courses', {courses})
    })
    .catch(e=>next(e));
});

router.get("/", isAdmin, (req,res)=>{
    res.render("admin/admin");
})



module.exports = router;