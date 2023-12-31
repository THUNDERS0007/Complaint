
const bodyParser = require('body-parser');
const express = require('express');
const server = express();

var router = express.Router();

var database = require('../database');

router.use(bodyParser.urlencoded());
router.use(bodyParser.json());

// Route to render the form
router.get('/', function (req, res, next) {
    database.query('SELECT * FROM dept', function (error, data) {
        res.render('sign', { title: 'Express', dept_data: data });
    });
});

// Route to handle fetching data for the dropdowns
router.get('/get_data', function (request, response, next) {
    var type = request.query.type;
    var search_query = request.query.parent_value;
    console.log(search_query)

    if (type == 'load_section') {
        var query = `SELECT section_id, section_name FROM section WHERE section_id IN 
            (SELECT section_id FROM section WHERE dept_id = ${search_query})`;
    }

    database.query(query, function (error, data) {
        var data_arr = data.map(row => row.section_name); 
        response.json(data_arr);
    });
});
router.post("/fetch", function (req, res, next) {
    var sapid = req.body.sapid;
    var name = req.body.name;
    var password = req.body.password;
    var role = req.body.role;
    var dept_id = req.body.dept;
    var section_name = req.body.section; 
    console.log(section_name);


    var sectionQuery = `SELECT section_id FROM section WHERE section_name = '${section_name}'`;

    database.query(sectionQuery, [section_name], function (sectionError, sectionResult) {
        if (sectionError) {
            console.error(sectionError);
            res.status(500).send('Error adding user.');
            return;
        }

        if (sectionResult.length === 0) {
            console.error('Section not found.');
            res.status(500).send('Error adding user: Section not found.');
            return;
        }
        var section_id = sectionResult[0].section_id;

        var query = `INSERT INTO user_id (user_session_id,created_dt,name, password, role, dept_id, sec_id,sapid) VALUES (NULL, current_timestamp(),'${name}','${password}','${role}','${dept_id}','${section_id}','${sapid}')`;

        database.query(query,function (error, result) {
            if (error) {
                console.error(error);
                res.status(500).send('Error adding user.');
            } else {
                console.log('User added successfully.');
                res.status(200).send('User added successfully.');
            }
        });
    });
});

module.exports = router;