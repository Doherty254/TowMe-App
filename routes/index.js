var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
})

/* GET About page. */
router.get('/about', function(req, res, next) {
  res.render('about');
})

/* GET Services page. */
router.get('/services', function(req, res, next) {
  res.render('services');
})

/* GET Contact page. */
router.get('/contact', function(req, res, next) {
  res.render('contact');
})


// logout functionality
router.get('/logout', (req, res) => {
  // kill session
  req.session.destroy(() => {
      res.redirect('/')
  })
})

module.exports = router;
