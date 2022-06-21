import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ReservationForm from "./ReservationForm";
import { createReservation } from "../utils/api"


function NewReservation(){
    const history = useHistory();
    const initialFormState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: ""
      };

    const [formData, setFormData] = useState({ ...initialFormState });
    const [formError, setFormError] = useState(null);
    const handleChange = ({ target }) => {
        setFormData({
            ...formData,
            [target.name]: target.value,
        });
    };

    const submitHandler = (event) => {
        event.preventDefault();
        const r_people = parseInt(formData.people)
        createReservation({...formData, people: r_people})
        .then(() => history.push(`/dashboard?date=${formData.reservation_date}`))
        .catch(setFormError)
    }



    return (
        <div className="container">
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: "20px 0"}}>
                <h1>Make a New Reservation</h1>
            </div>
            <ReservationForm handleChange={handleChange} submitHandler={submitHandler} formData={formData} formError={formError} />
            
        </div>
        
    )
};


export default NewReservation;