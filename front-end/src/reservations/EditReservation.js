import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { readReservation, updateReservation } from "../utils/api";
import { formatAsDate, formatAsTime } from "../utils/date-time"
import ReservationForm from "./ReservationForm";


function EditReservation(){
    const history = useHistory();
    const { reservation_id } = useParams();
    const [reservation, setReservation] = useState({});
    const [formError, setFormError] = useState(null);

    useEffect(()=>{
        async function loadReservation() {
            const abortController = new AbortController();
            const reservationFromAPI = await readReservation(reservation_id);
            setReservation(reservationFromAPI);
            
            const r_date = formatAsDate(reservationFromAPI.reservation_date);
            const r_time = formatAsTime(reservationFromAPI.reservation_time);
            setFormData({...reservationFromAPI, reservation_date: r_date, reservation_time: r_time})
            return () => abortController.abort();
        };
        loadReservation();
    }, [reservation_id]);

    const initialFormState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: ""
    };
    const [formData, setFormData] = useState({ ...initialFormState });

    const handleChange = ({ target }) => {
        setFormData({
            ...formData,
            [target.name]: target.value,
        });
    };

    const submitHandler = (event) => {
        event.preventDefault();
        const r_people = parseInt(formData.people)
        updateReservation({...formData, people: r_people})
        .then(() => history.push(`/dashboard?date=${formData.reservation_date}`))
        .catch(setFormError)
    }
    
    return (
        <div className="container">
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: "20px 0"}}>
                <h1>Change Reservation for {reservation.first_name} {reservation.last_name}</h1>
            </div>
            <ReservationForm handleChange={handleChange} submitHandler={submitHandler} formData={formData} formError={formError} />
        </div>
        
    )
};




export default EditReservation;