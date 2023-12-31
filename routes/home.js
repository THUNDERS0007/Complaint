const bodyParser = require('body-parser');
const express = require('express');
const server = express();

var router = express.Router();

var database = require('../database');


router.use(bodyParser.urlencoded());
router.use(bodyParser.json());



router.get("/", function(req, res, next){
        var name = req.session.name;
        if (typeof name == 'undefined'){
            res.redirect('/');
        }
        else{
    var name = req.session.name;
    var query = `SELECT * from user_id WHERE name = '${name}'`;
    database.query(query,function(error,data){
        const name = data[0].name;
        
        const role = data[0].Role;
        console.log(name); 
        console.log(role);
        res.render('home', { title: 'HOME PAGE',name : name,role : role});
        
});
        }
});




module.exports = router;