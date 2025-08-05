const Workout = require('../models/workoutsModel')
const mongoose = require('mongoose')

// get all workout
const getAllWorkouts = async(req,res) => {
    const allWorkouts = await Workout.find({}).sort({createdAt: -1})

    res.status(200).json(allWorkouts)
}

// get a single workout
const getSingleWorkout = async(req,res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No workout found'})
    }

    const workout = await Workout.findById(id)

    if(!workout) {
        return res.status(404).json({error: 'No workout found'})
    }

    res.status(200).json(workout)
}

// create a new workout 
const createWorkout = async(req, res) => {
    const {title, load, reps} = req.body

    let emptyFields = []
    if (!title) {
        emptyFields.push('title')
    }
    if (!load) {
        emptyFields.push('load')
    }
    if (!reps) {
        emptyFields.push('reps')
    }
    if (emptyFields.length > 0) {
        return res.status(400).json({error: 'Please input all fields', emptyFields})
    }
    
    try {
        const workout = await Workout.create({title, load, reps})
        res.status(200).json(workout)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// delete a workout
const deleteWorkout = async(req, res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No workout found'})
    }

    const workout = await Workout.findByIdAndDelete({_id: id})

    if(!workout) {
        return res.status(404).json({error: 'No workout found'})
    }
    res.status(200).json(workout)

}

// update a workout 
const updateWorkout = async(req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No workout found'})
    }

    const workout = await Workout.findByIdAndUpdate({_id: id}, {...req.body})

    res.status(200).json(workout)
}

module.exports = {
    getAllWorkouts, 
    getSingleWorkout,
    createWorkout, 
    deleteWorkout, 
    updateWorkout
}

