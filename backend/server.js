require('dotenv').config()

const express = require('express')
const workoutRoutes = require('./routes/workouts')
const mysql = require('mysql2')

// create connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'workout_app',
}).promise()

// test DB connection
pool.query('SELECT 1')
  .then(() => {
    console.log('✅ Connected to MySQL database')

    // express app
    const app = express()

    // middleware
    app.use(express.json())

    app.use((req, res, next) => {
      console.log(req.path, req.method)
      next()
    })

    // pass pool to routes via req object if needed
    app.use((req, res, next) => {
      req.pool = pool
      next()
    })

    app.use('/api/workouts', workoutRoutes)

    // listen for requests
    const PORT = process.env.PORT || 4000
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error(' MySQL connection failed:', err)
  })
