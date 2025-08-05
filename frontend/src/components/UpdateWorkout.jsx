import { useState } from "react"
import Modal from "./Modal"
import WorkoutForm from "./WorkoutForm"

const UpdateWorkout = ({ workout }) => {
    const [showModal, setShowModal] = useState(false)

    return (
        <div className="updateWorkout">
            <span className="update" onClick={() => setShowModal(true)}>
                <i class="bi bi-pencil-square"></i>
            </span>
            <Modal showModal={showModal} setShowModal={setShowModal}>
                <WorkoutForm workout={workout} setShowModal={setShowModal}/>
            </Modal>
        </div>
    )

}

export default UpdateWorkout