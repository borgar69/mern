import { useState } from "react"
import { useWorkoutsContext } from "../hooks/useWorkoutsContext"

const WorkoutForm = ({ workout, setShowModal }) => {
    const[title, setTitle] = useState(workout === null ? '' : workout.title)
    const[load, setLoad] = useState(workout === null ? '' : workout.load)
    const[reps, setReps] = useState(workout === null ? '' : workout.reps)
    const[error, setError] = useState(null)
    const[emptyFields, setEmptyFields] = useState([])
    const { dispatch } = useWorkoutsContext()
    
    const handleSubmit = async(e) => {
        e.preventDefault()
        const workoutSubmitted = {title, load, reps}
        

        const response = await fetch('api/workouts', {
            method: 'POST', 
            body: JSON.stringify(workoutSubmitted), 
            headers: {
                'Content-Type' : 'application/json'
            }
        })
        const json = await response.json()

        if(!response.ok) {
            setError(json.error)
            setEmptyFields(json.emptyFields)
        }
        if(response.ok) {
            setTitle('')
            setLoad('')
            setReps('')
            setError(null)
            setEmptyFields([])
            console.log('new workout added')
            dispatch({type: 'CREATE_WORKOUT', payload: json})
        }

    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        const workoutSubmitted = {title, load, reps}
        console.log('lmao')
        const response = await fetch('api/workouts/' + workout.id, {
            method: 'PATCH', 
            body: JSON.stringify(workoutSubmitted), 
            headers: {
                'Content-Type' : 'application/json'
            }
        })
        
        const json = await response.json()
        console.log('lmao')
        if(!response.ok) {
            setError(json.error)
            setEmptyFields(json.emptyFields)
        }
        if(response.ok) {
            setError(null)
            setEmptyFields([])
            setShowModal(false) 
            dispatch({type: 'UPDATE_WORKOUT', payload: json})
            console.log('workout updated')
        }
    }

    return(
        <form className="create" onSubmit={workout && workout.id ? handleUpdate : handleSubmit}>
            <h3>{workout === null ? 'Add new ' : 'Update '}workout</h3>
            <label>Exercise Title: </label>
            <input 
                type='text'
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                className={ emptyFields.includes('title') ? 'error' : '' }
            />

            <label>Load (kg): </label>
            <input 
                type='number'
                onChange={(e) => setLoad(e.target.value)}
                value={load}
                className={ emptyFields.includes('load') ? 'error' : '' }
            />

            <label>Reps: </label>
            <input 
                type='number'
                onChange={(e) => setReps(e.target.value)}
                value={reps}
                className={ emptyFields.includes('reps') ? 'error' : '' }
            />

            <button>{workout === null ? 'Add new ' : 'Update '}workout</button>

            {error && <div className="error">{error}</div>}
        </form>
        
    )
}

export default WorkoutForm