var express = require('express');
var passport = require('passport');

var router = express.Router();


/* GET home page. */
router.get('/', passport.authenticate('mca-website-strategy', {session: false }),
    function(req, res){
      res.render('index', {title: 'ThinkIBM Consumer'});
    }
);

router.get('/authenticated', function (req, res) {
  res.render('index', {title: 'ThinkIBM Consumer'});
});



module.exports = router;
