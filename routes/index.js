const bodyParser = require('body-parser');
const express = require('express');
const server = express();

var router = express.Router();

var database = require('../database');

router.use(bodyParser.urlencoded());
router.use(bodyParser.json());

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Login', session: req.session });
});

router.post('/login', function(request, response, next){

    var sapid = request.body.name;

    console.log(sapid);

    var password = request.body.password;

    if(sapid && password)
    {
        query = `
        SELECT * FROM user_id
        WHERE sapid = '${sapid}';
        `;

        database.query(query, function(error, data){

            if(data.length > 0)
            {
                for(var count = 0; count < data.length; count++)
                {
                    if(data[count].password == password)
                    {
                        console.log(sapid);
                        request.session.name = data[count].name;
                        request.session.dept_id = data[count].dept_id; 
                        request.session.Role = data[count].Role;
                        request.session.sapid = data[count].sapid;

                        response.redirect("/home");
                    }
                    else
                    {
                        response.send('Incorrect Password');
                    }
                }
            }
            else
            {
                response.send('Incorrect SAPID');
            }
            response.end();
        });
    }
    else
    {
        response.send('Please Enter SAPID and Password Details');
        response.end();
    }

});
router.get('/logout', function(request, response, next){

    request.session.destroy();

    response.redirect("/");

});



module.exports = router;