import React from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";



function ReservationForm({ handleChange, submitHandler, formData, formError }){
    const history = useHistory();
    
    return (
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
    )
}


export default ReservationForm;