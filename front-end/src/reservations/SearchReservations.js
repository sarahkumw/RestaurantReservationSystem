import React, { useState, useEffect } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ListReservations from "./ListReservations";


function SearchReservations(){
    const [reservations, setReservations] = useState([]);
    const [reservationsError, setReservationsError] = useState(null);
    const [query, setQuery] = useState("");

    useEffect(loadReservations, []);
    
    function loadReservations(){
        const abortController = new AbortController();
        setReservationsError(null);
        listReservations({}, abortController.signal)
        .then((response)=> setReservations(response))
        .catch(setReservationsError);
        return () => abortController.abort();
    }

    const handleChange = ({ target }) => {
        return setQuery(target.value);
        
    };

    const search = () => {
        listReservations({mobile_number: query})
        .then(setReservations)
    }

    return (
        <div>
            <div style={{marginBottom: "40px"}}>
                <h1 style={{margin: "20px 0"}}>Search Reservations</h1>
                <div>
                    <form style={{display: "flex"}}>
                        <input type="text" name="mobile_number" placeholder="Mobile Number" value={query} onChange={handleChange} style={{marginRight: "10px"}} />
                        <button type="submit" className="btn btn-primary" onClick={search}>Find</button>
                    </form>
                </div>
            </div>
            <div>
                <ErrorAlert error={reservationsError} />
                {reservations.length === 0 && <ErrorAlert error={{error: true, message: 'No reservations found'}} />}
                <ListReservations reservations={reservations} />
            </div>
        </div>
    )
}


export default SearchReservations;