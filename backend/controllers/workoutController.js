import mysql from 'mysql2'

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'workout_app',
}).promise()

// Get all workouts
const getAllWorkouts = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM workouts ORDER BY created DESC')
    res.status(200).json(rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Get a single workout
const getSingleWorkout = async (req, res) => {
  const { id } = req.params

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format' })
  }

  try {
    const [rows] = await pool.query('SELECT * FROM workouts WHERE id = ?', [id])
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No workout found' })
    }
    res.status(200).json(rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Create a new workout
const createWorkout = async (req, res) => {
  const { title, load, reps } = req.body

  const emptyFields = []
  if (!title) emptyFields.push('title')
  if (!load) emptyFields.push('load')
  if (!reps) emptyFields.push('reps')

  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please input all fields', emptyFields })
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO workouts (title, `load`, reps) VALUES (?, ?, ?)',
      [title, load, reps]
    )
    const [newWorkout] = await pool.query('SELECT * FROM workouts WHERE id = ?', [result.insertId])
    res.status(200).json(newWorkout[0])
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Delete a workout
const deleteWorkout = async (req, res) => {
  const { id } = req.params

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format' })
  }

  try {
    const [rows] = await pool.query('SELECT * FROM workouts WHERE id = ?', [id])
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No workout found' })
    }

    await pool.query('DELETE FROM workouts WHERE id = ?', [id])
    res.status(200).json(rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Update a workout
const updateWorkout = async (req, res) => {
  const { id } = req.params
  const { title, load, reps } = req.body

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format' })
  }

  try {
    const [rows] = await pool.query('SELECT * FROM workouts WHERE id = ?', [id])
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No workout found' })
    }

    await pool.query(
      'UPDATE workouts SET title = ?, `load` = ?, reps = ? WHERE id = ?',
      [title || rows[0].title, load || rows[0].load, reps || rows[0].reps, id]
    )

    const [updatedWorkout] = await pool.query('SELECT * FROM workouts WHERE id = ?', [id])
    res.status(200).json(updatedWorkout[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export {
  getAllWorkouts,
  getSingleWorkout,
  createWorkout,
  deleteWorkout,
  updateWorkout
}
