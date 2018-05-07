const router = require('express').Router();
const Course = require('../models/Course');
const User = require('../models/User');
const moment = require('moment');
const fs = require('fs');
const path = require('path');

function isAdmin(req,res, next){
    if(!req.isAuthenticated()) return res.redirect('/auth/login');
    if(req.user.role !== "ADMIN") return res.redirect('/auth/profile');
    return next();
}


// User.find({}).exec()
//   .then(function(docs) {
//     User.csvReadStream(docs)
//       .pipe(fs.createWriteStream('users.csv'));
//   });


//testing export **  Pinche hermoso **
router.get('/users/export', isAdmin, (req,res,next)=>{
    let query = { role: { $not: { $eq: "ADMIN" } } };
    User.find(query)
        .populate('app')
        .then(docs=>{
            User.csvReadStream(docs)
            .pipe(fs.createWriteStream(path.join(__dirname, '../public', 'bliss.csv')))
            .on('finish', function () {
                res.sendFile(path.join(__dirname, '../public', 'bliss.csv'));
              });
        })
        
});

router.get('/users/:id', isAdmin, (req,res, next)=>{
    User.findById(req.params.id)
    .populate('app')
    .populate('selectedCourse')
    .then(user=>{
        res.render('admin/userDetail', {user});
    })
    .catch(e=>next(e));
})

router.post('/users', isAdmin, (req,res,next)=>{
    const field = req.body.search;
    query = {$or:[
           {username:{$regex: field, $options: 'i'}},
           {email:{$regex: field, $options: 'i'}},
            // {"app.name":{$regex:field, $options: 'i'}},
            // {"app.surName":{$regex:field, $options: 'i'}},
            // {"app.email":{$regex:field, $options: 'i'}}
        ]
    };
    User.find(query)
    .populate('app')
    .then(r=>{
        res.render('admin/users', {users:r});
    })
    .catch(e=>next(e))
})

router.get('/users', isAdmin, (req,res,next)=>{
    const options = {};
    let query = { role: { $not: { $eq: "ADMIN" } } };
    if(req.query.page && req.query.page <= req.query.pages && req.query.page > 0){
		options["page"] = Number(req.query.page);
		delete req.query.page;
	}
    options["limit"] = Number(10);
    options['populate'] = ['app', 'selectedCourse'];
    User.paginate(query,options)
    .then(result=>{
        res.render('admin/users', {users:result.docs,result});
    })
    .catch(e=>next(e));
});


router.get('/courses/:id', isAdmin, (req,res,next)=>{
    Course.findById(req.params.id)
    .then(course=>{
        console.log(course)
        course.fecha = moment(course.date).format('YYYY-MM-DD'); 
        course.endFecha = moment(course.endDate).format('YYYY-MM-DD');
        res.render('admin/courseDetail', {course});
    })
    .catch(e=>next(e));
})

router.post('/courses/:id', isAdmin, (req,res, next)=>{
    if(req.body.active) req.body.active = true;
    else req.body.active = false;
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
    res.redirect("admin/users");
})



module.exports = router;