// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()
const { find, findById, add, findBy } = require('../users/users-model')


/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */


/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */
router.post('/login', async (req, res, next) => {
  try {
const {username, password} = req.body
const user = await findBy({username}).first()

// console.log('auth user: ', user);

const passwordValid = await bcrypt.compare(password, user ? user.password : '')

if(!user || !passwordValid) {
  return res.status(401).json({
    message: "Invalid credentials"
  })
}

req.session.user = user

res.json({
  message: `Welcome ${user.username}`
})

  } catch(err) {
    next(err)
  }
})

/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */
router.get('/logout', async (req, res, next) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        next(err)
      } else {
        res.status(204).end()
      }
    })
  } catch (err) {
    next(err)
  }
})

 
// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router