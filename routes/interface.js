const express = require("express");
const router = express.Router();
const App = require("../models/Application");

router.get('/', (req,res)=>{
	App.find().limit(10)
	.then(apps=>res.render('admin', {apps}))
	.catch(e=>res.send(e));
});

module.exports = router;