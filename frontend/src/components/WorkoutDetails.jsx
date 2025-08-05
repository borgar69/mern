import { useWorkoutsContext } from "../hooks/useWorkoutsContext"
import { formatDistanceToNow } from "date-fns";
import UpdateWorkout from "./UpdateWorkout";

const WorkoutDetails = ({workout}) => {
    const { dispatch } = useWorkoutsContext()
    
    const handleClick = async () => {
        const response = await fetch('api/workouts/' + workout._id, {
            method: 'DELETE'
        })
        const json = await response.json()

        if (response.ok){
            dispatch({type: 'DELETE_WORKOUT', payload: json})
        }
    }

    return (
        <div className="workoutdetails">
            <h4>{workout.title}</h4>
            <p><strong>Load (kg): </strong>{workout.load}</p>
            <p><strong>Reps: </strong>{workout.reps}</p>
            <p>Created {formatDistanceToNow(new Date(workout.createdAt), {addSuffix: true})}</p>
            <span className="delete" onClick={handleClick}>
                <i class="bi bi-trash"></i>
            </span>
            <UpdateWorkout workout={workout} />
        </div>
    )
    
}

export default WorkoutDetails