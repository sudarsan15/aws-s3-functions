/*

Author Name  : Sudarsan PS 
website      : www.sudarsanps.com
Description  : This is for Fetching contents from S3 and performing actions on the same 
Date         : 5th April 2018    

*/

var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');
var fs = require('fs');
require('dotenv').config();

// console.log(process.env);

var config = require('../config/config');

var s3 = new AWS.S3();

var S3Url = "https://s3."+process.env.S3_REGION+".amazonaws.com/"+process.env.S3_BUCKET+"/";


/* GET home page. */
router.get('/', function(req, res, next) {
 	var params = {
	    Bucket: process.env.S3_BUCKET,
	};

	s3.listObjects(params, function(err, data) {

		if(err){
			
			console.log("err:"+err);
			req.flash('error',"Seems like something went. Please try again");
			res.render('fetch/index', { title: 'Listing from S3' ,success: req.flash('success','') ,error: req.flash('error',''), csrfToken: req.csrfToken(),data : null , url  : S3Url });
		}
		else{
			
			var content = data.Contents;

			if(content.length <= 0){
				req.flash('error',"Seems like S3 is empty");
				res.render('fetch/index', { title: 'Listing from S3' ,success: req.flash('success','') ,error: req.flash('error',''), csrfToken: req.csrfToken(),data : null , url  : S3Url });
			}
			else{

				// req.flash('success',"S3 contents are listed above");
				res.render('fetch/index', { title: 'Listing from S3' ,success: req.flash('success','') ,error: req.flash('error',''), csrfToken: req.csrfToken(),data : content ,  url  : S3Url });
			}
		}

	});	
});

module.exports = router;

