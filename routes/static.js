/*

Author Name  : Sudarsan PS 
website      : www.sudarsanps.com
Description  : This is for implementing the static upload of files to S3 bucket 
Date         : 5th April 2018    

*/

var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');
var fs = require('fs');
require('dotenv').config();

var config = require('../config/config');

var s3 = new AWS.S3();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('static/index', 
  	{ title: 'Static upload' ,
  	  success: req.flash('success','') ,
  	  error: req.flash('error',''), 
  	  csrfToken: req.csrfToken(),
  	  imgUrl :  req.protocol + '://' + req.get('host')+'/images/'

  	});
});

/*

 Function for reading file from the server and upload it to S3

*/

router.post('/',function(req,res,next){

	fs.readFile('./public/images/sample.jpeg', function (err, data) {
	  if (err) { throw err; }

	  var params = {
	      Bucket: process.env.S3_BUCKET,
	      Key: '1.jpg',
	      Body: data,
	      ContentType : 'image/jpeg',
	      ACL:  'public-read'
	  };

	  	s3.putObject(params, function (err, uploadResult) {
	      if (err) {
	          console.log("Error uploading data: ", err);
	          req.flash('error','Upload unsuccessful');
	          res.redirect('/static/');

	      } else {
	          console.log("Successfully uploaded data to testbucket");
	          console.log("uploadResult:"+JSON.stringify(uploadResult));
	          req.flash('success','Upload successful');
	          res.redirect('/static/');
	      }
		});
	});	

});

module.exports = router;
