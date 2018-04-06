var express = require('express');
var router = express.Router();
const appController = require("../controllers/app.controller");

const App = require("../models/Application");

function exists(req,res,next){
	App.findOne({name:req.body.name, email:req.body.email})
	.then(r=>res.send(r))
	.catch(e=>next());
}

router.get('/all', appController.getAll);
router.post('/add', appController.findOrCreate);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
