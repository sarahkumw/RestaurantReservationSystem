import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { readReservation, updateReservation } from "../utils/api";
import { formatAsDate, formatAsTime } from "../utils/date-time"
import ErrorAlert from "../layout/ErrorAlert"


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
            <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <form onSubmit={submitHandler} style={{display: "flex", flexDirection: "column", padding: "0 40px"}}>
                    <label style={{display: "flex", justifyContent: "space-between"}}>First Name
                        <input id="first_name" type="text" name="first_name" value={formData.first_name} onChange={handleChange} style={{marginLeft: "40px"}}/>
                    </label>
                    <label style={{display: "flex", justifyContent: "space-between"}}>Last Name
                        <input id="last_name" type="text" name="last_name" value={formData.last_name} onChange={handleChange} style={{marginLeft: "40px"}}/>
                    </label>
                    <label style={{display: "flex", justifyContent: "space-between"}}>Mobile Number
                        <input id="mobile_number" type="text" placeholder="###-###-####" name="mobile_number" value={formData.mobile_number} onChange={handleChange} style={{marginLeft: "40px"}}/>
                    </label>
                    <label style={{display: "flex", justifyContent: "space-between"}}>Date
                        <input id="reservation_date" type="date" placeholder="YYYY-MM-DD" pattern="\d{4}-\d{2}-\d{2}" name="reservation_date" value={formData.reservation_date} onChange={handleChange} style={{marginLeft: "40px"}}/>
                    </label>
                    <label style={{display: "flex", justifyContent: "space-between"}}>Time
                        <input id="reservation_time" type="time" placeholder="HH:MM" pattern="[0-9]{2}:[0-9]{2}" name="reservation_time" value={formData.reservation_time} onChange={handleChange} style={{marginLeft: "40px"}}/>
                    </label>
                    <label style={{display: "flex", justifyContent: "space-between"}}>People
                        <input id="people" type="number" min="1" name="people" value={formData.people} onChange={handleChange} style={{marginLeft: "40px"}}/>
                    </label>
                    <ErrorAlert error={formError} />
                    <div style={{display: "flex", justifyContent: "space-evenly", marginTop: "10px"}}>
                        <button type="button" className="btn btn-dark" onClick={()=>history.goBack()}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Submit</button>                    
                    </div>
                </form>
            </div>
        </div>
        
    )
};




export default EditReservation;