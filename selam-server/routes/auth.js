const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body

    // Generate a new password hash
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    })

    // Save the user and respond
    const savedUser = await newUser.save()
    res.status(200).json(savedUser)
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Find the user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Validate the password
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(400).json({ error: 'Wrong password' })
    }

    res.status(200).json(user)
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

module.exports = router
