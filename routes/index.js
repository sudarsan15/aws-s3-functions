/*

Author Name  : Sudarsan PS 
website      : www.sudarsanps.com
Description  : This is for implementing the dynamic upload of files to S3 bucket 
Date         : 4th April 2018    

*/
var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');
require('dotenv').config();

var config = require('../config/config');
var s3 = new AWS.S3();

//Setting upload parameters

var upload = multer({
  		storage: multerS3({
		    s3: s3,
		    bucket: process.env.S3_BUCKET,
		    contentType: multerS3.AUTO_CONTENT_TYPE,
		    acl : 'public-read',
		    serverSideEncryption: 'AES256',
		    metadata: function (req, file, cb) {
		      cb(null, {fieldName: file.fieldname});
		    },
		    key: function (req, file, cb) {
		      cb(null, Date.now().toString())
		    }
  		})
	}).fields([
		{ name: 'file', maxcount: 1 }
]);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'File Upload to S3' ,success: req.flash('success','') ,error: req.flash('error',''), csrfToken: req.csrfToken()});
});


// POST functionality for saving to s3 bucket
router.post('/', function(req, res, next){

	console.log("inside post");
	upload(req, res, function (err,result) {
		console.log("inside upload");

		if(err){
			console.log("err:"+err);	
			req.flash('error','Upload unsucessful');
			res.redirect('/');
		}
		else{
			console.log("succesfully updated");
			req.flash('success','succesfully updated');
			res.redirect('/');
		}
	});	
});

/*

  Description : S3 object delete functionality
  Date        : 5th April 2018 	


*/
router.post('/s3delete',s3delete);

function s3delete(req,res){

	var objectKey = req.body.key;

	if(objectKey != null){
		var params = {
		    Bucket: process.env.S3_BUCKET,
		    Key : objectKey
		};

		s3.deleteObject(params, function(err, data) {

			if(err){
				console.log("err:"+err);
				req.flash('error','Unable to delete.Please try after some time');
				res.redirect('/fetch/');

			}	
			else{
				
				req.flash('success','Object deleted succesfully');
				res.redirect('/fetch/');
			}
		});	

	}	
	else{
		req.flash('error','Couldnt find anything to perform to delete function');
		res.redirect('/fetch/');
	}

}

module.exports = router;
