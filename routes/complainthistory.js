const bodyParser = require('body-parser');
const express = require('express');
const server = express();

var router = express.Router();

var database = require('../database');


router.use(bodyParser.urlencoded());
router.use(bodyParser.json());

router.get('/',function(req,res,next){
    var name = req.session.name;
    var sapid = req.session.sapid;
    if (typeof sapid == 'undefined'){
        res.redirect('/');
    }
    else{
    const query = `SELECT DISTINCT
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
    

        res.render('complainthistory', { title: 'HISTORY PAGE', sampleData: data ,action:'list'});

        });
    }
});
router.post('/show',function(req,res,next)
{
    const complaint_id= req.body.complaint_id;
        const query = `SELECT DISTINCT
        cm.*,
        c.*,
        d.dept_name,
        h.*,
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
      JOIN
        history h ON h.complaint_id = c.complaint_id
      WHERE
        h.complaint_id = '${complaint_id}'
        `;

    database.query(query, function(error, data){
      if (error) {
        console.error(error);
        res.status(500).send('Error searching for complaint.');
        return;
    } else {

      database.query(query, function (error, data) {
        if (error) {
            console.error(error);
            res.status(500).send('Error searching for complaint.');
            return;
        }   else{
          console.log(data);
          res.render('complainthistory', { title: 'HISTORY PAGE', sampleData: data ,action:'list'});
        }

    });
    }
      
      
    });
});
module.exports = router;