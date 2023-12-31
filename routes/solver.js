const bodyParser = require('body-parser');
const express = require('express');
const server = express();

var router = express.Router();

var database = require('../database');


router.use(bodyParser.urlencoded());
router.use(bodyParser.json());



router.get("/", function(req, res, next){
    var sapid = req.session.sapid;
    var dept_id = req.session.dept_id;
    var role = req.session.Role;
    if (typeof sapid == 'undefined'){
        res.redirect('/');
    }
    else{
    var complainSearchQuery = `SELECT * FROM complaint_master`;

    database.query(complainSearchQuery, function (error, complaintResult) {
        if (error) {
            console.error(error);
            res.status(500).send('Error searching for complaint.');
            return;
        }

        if (complaintResult.length === 0) {
            res.status(404).send('Complaint not found.');
            return;
        }

    var deptQuery = `SELECT * FROM dept`;
    database.query(deptQuery, function (error, Dept) {
        if (error) {
            console.error(error);
            res.status(500).send('Error searching for complaint.');
            return;
        }

        
        var query = `SELECT DISTINCT
        cm.*,
        c.*,
        d.dept_name,
        DATE_FORMAT(c.created_dt, '%a %b %d %Y %H:%i:%s') AS formatted_created_dt,
        ui.name,
        ui.sapid
      FROM
        complaint_master cm
      JOIN
        complaint c ON cm.id = c.item
      JOIN
        dept d ON d.dept_id = cm.dept_id
      JOIN
        user_id ui ON ui.sapid = c.created_by
        where c.created_by != '${sapid}'
        AND cm.dept_id = '${dept_id}'
        AND c.status = 'In Process';
        `;
        database.query(query, function (error, data) {
            if (error) {
                console.error(error);
                res.status(500).send('Error searching for complaint.');
                return;
            }
    

        res.render('solver', { title: 'SOLVER PAGE', sampleData: data ,complaint_data : complaintResult,dept_data : Dept,action:'list',role_data: role});

        });
    });
});
    }
});


router.post('/review/:complaint_id', function(req, res, next){
    
    var complaint_id = req.params.complaint_id;
    var review = req.body.view;
    console.log(review);

    var query = `UPDATE complaint SET  
        review = "${review}"
        where complaint_id = '${complaint_id}'`;
        database.query(query, function (error, result) {
            if (error) {
                console.error(error);
                res.status(500).send('Error adding user.');
            } else {
                res.redirect("/solver");
            }
    });
});

router.get('/edit/:complaint_id', function(req, res, next){

    var complaint_id = req.params.complaint_id;
    var sapid = req.session.sapid;
    

        var query = `UPDATE complaint SET  
        status = "Solved",
        solver = "${sapid}",
        resolve_dt = CURDATE()
        where complaint_id = '${complaint_id}'`;

        database.query(query, function (error, result) {
            if (error) {
                console.error(error);
                res.status(500).send('Error adding user.');
            } else {
                const query1 = `INSERT INTO history (history_id, complaint_id, sapid, type) VALUES (NULL,${complaint_id},'${sapid}', 'Reviewed');`
                database.query(query1 ,function (error, result) {
                    if (error) {
                        console.error(error);
                        res.status(500).send('Error adding user.');
                    } else {
                    res.redirect("/solver");
                    }
                });
            }
    });
});


module.exports = router;