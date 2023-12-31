const bodyParser = require('body-parser');
const express = require('express');
const server = express();

var router = express.Router();

var database = require('../database');


router.use(bodyParser.urlencoded());
router.use(bodyParser.json());



router.get("/", function(req, res, next){
    var name = req.session.name;
    var role = req.session.Role;
    var sapid = req.session.sapid;
    if (typeof name == 'undefined'){
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

        if (Dept.length === 0) {
            res.status(404).send('Complaint not found.');
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
        where c.created_by = '${sapid}';
        `;
        database.query(query, function (error, data) {
            if (error) {
                console.error(error);
                res.status(500).send('Error searching for complaint.');
                return;
            }
    

        res.render('complaint', { title: 'COMPLAIN PAGE', sampleData: data ,complaint_data : complaintResult,dept_data : Dept,action:'list',role_data : role});

        });
    });
});
    }
});



router.get('/get_data1', function (request, response, next) {
    var type = request.query.type;
    var search_query = request.query.parent_value;

    if (type == 'load_complaint') {
        var query5 = `SELECT id, complaint FROM complaint_master WHERE id IN 
        (SELECT id FROM complaint_master WHERE dept_id = ${search_query})`;
    }

    database.query(query5, function (error, data) {
        var data_a = data.map(row => row); 
        response.json(data_a);
    });
});






router.post('/add_complaint', function (req, res, next) {

    const complaint = req.body.Complaint;
    const sapid = req.session.sapid;
    const explain = req.body.explain;
    const query = `INSERT INTO complaint (complaint_id, issue_detail, item, status, resolve_dt, created_by, created_dt, modify_dt) 
                        VALUES (NULL,'${explain}','${complaint}','In Process',NULL,'${sapid}',current_timestamp(),NULL);`
       

        database.query(query, function (error, result) {
            if (error) {
                console.error(error);
                res.status(500).send('Error adding user.');
            } else {
                const con = result.insertId;
                 const query1 = `INSERT INTO history (history_id, complaint_id, sapid, type) VALUES (NULL,${con},'${sapid}', 'Created');`
                database.query(query1 ,function (error, result) {
                    if (error) {
                        console.error(error);
                        res.status(500).send('Error adding user.');
                    } else {
                    res.redirect("/complaint");
                    }
                });
            }
    });
});



router.post('/edit/:complaint_id', function(req, res, next){

	var complaint = req.body.Complaint;
    var explain = req.body.explain;
    var complaint_id = req.params.complaint_id;

        var query = `UPDATE  complaint SET  issue_detail= "${explain}", 
        item = "${complaint}",
        modify_dt = CURDATE()
        where complaint_id = '${complaint_id}'`;

        database.query(query, function (error, result) {
            if (error) {
                console.error(error);
                res.status(500).send('Error adding user.');
            } else {
                const query1 = `INSERT INTO history (history_id, complaint_id, sapid, type) VALUES (NULL,${complaint_id},'${sapid}', 'Edited');`
                database.query(query1 ,function (error, result) {
                    if (error) {
                        console.error(error);
                        res.status(500).send('Error adding user.');
                    } else {
                    res.redirect("/complaint");
                    }
                });
            }
    });
});
router.get('/delete/:complaint_id', function(request, response, next){

	var complaint_id = request.params.complaint_id; 

	var query = `
	DELETE FROM complaint WHERE complaint_id = "${complaint_id}"
	`;

	database.query(query, function(error, data){

		if(error)
		{
			throw error;
		}
		else
		{
            const query1 = `INSERT INTO history (history_id, complaint_id, sapid, type) VALUES (NULL,${complaint_id},'${sapid}', 'Deleted');`
                database.query(query1 ,function (error, result) {
                    if (error) {
                        console.error(error);
                        res.status(500).send('Error adding user.');
                    } else {
                    res.redirect("/complaint");
                    }
                });
		}

	});

});

module.exports = router;