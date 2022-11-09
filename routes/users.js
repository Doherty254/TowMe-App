var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();

var connection = require('../db-config')

/* GET users listing. */

// display login page
router.get('/login', (req, res) => {
  const user = {
      email: '',
      password: ''
  }
  res.render('users/login', {error: false, user: user})
})

// process login form
router.post('/login', (req, res) => {
  const user = {
      email: req.body.email,
      password: req.body.password
  }

  let sql = 'SELECT * FROM customers WHERE email = ?'
  connection.query(
      sql, [user.email], (error, results) => {
          if (results.length > 0) {
              bcrypt.compare(user.password, results[0].password, (error, passwordMatches) => {
                  if (passwordMatches) {
                      req.session.personID = results[0].personID
                      req.session.username = results[0].fullname.split(' ')[0]
                      res.redirect('/')
                  } else {
                      let message = 'Incorrect password.'
                      res.render('users/login', {error: true, message: message, user: user})
                  }
              })
          } else {
              let message = 'Account does not exist. Please create one.'
              res.render('users/login', {error: true, message: message, user: user})
          }
      }
  )
})

// display signup page
router.get('/signup', (req, res) => {
  const user = {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
  }
  res.render('users/signup', {error: false, user: user})
})

// process signup form
router.post('/signup', (req, res) => {
  const user = {
      name: req.body.fullname,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword
  }

  if (user.password === user.confirmPassword) {
      
      // check if user exists

      let sql = 'SELECT * FROM customers WHERE email = ?'
      connection.query(
          sql, [user.email], (error, results) => {
              if (results.length > 0) {
                  let message = 'Account already exists with the email provided.'
                  res.render('users/signup', {error: true, message: message, user: user})
              } else {
                  bcrypt.hash(user.password, 10, (error, hash) => {
                      let sql = 'INSERT INTO customers (fullname, email, password) VALUES (?,?,?)'
                      connection.query(
                          sql,
                          [
                            user.name,
                            user.email,  
                            hash
                          ], 
                          (error, results) => {
                            console.log(results)
                              res.send('account successfully created')
                          }
                      )
                  })
              }
          }
      )

  } else {
      let message = 'Password/confirm password mismatch'
      res.render('users/signup', {error: true, message: message, user: user})
  }
})



module.exports = router;
