// Require the `restricted` middleware from `auth-middleware.js`. You will need it here!
const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()
const { find, findById, add } = require('./users-model')

/**
  [GET] /api/users

  This endpoint is RESTRICTED: only authenticated clients
  should have access.

  response:
  status 200
  [
    {
      "user_id": 1,
      "username": "bob"
    },
    // etc
  ]

  response on non-authenticated:
  status 401
  {
    "message": "You shall not pass!"
  }
 */
router.get('/', async (req, res, next) => {
  try {
    const users = await find()
    res.json(users)
  } catch(err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
const user = await findById(req.params.id)
res.json(user)
  } catch(err) {
    next(err)
  }
})


router.post('/', async (req, res, next) => {
  try {
const user = await req.body

const hash = bcrypt.hashSync(user.password, 12)
user.password = hash

const newUser = await add(user)
res.json(newUser)
  } catch(err) {
    next(err)
  }
})


// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router