import React, { useState, useEffect } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ListReservations from "./ListReservations";
import { updateReservationStatus } from "../utils/api";


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

    const cancelRes = (reservation) => {
        const abortController = new AbortController();
        if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")){
            const newStatus = {
                reservation_id: reservation.reservation_id,
                status: "cancelled"
            }
            updateReservationStatus(newStatus, abortController.signal)
            .then(() => loadReservations())
            .catch(setReservationsError)
        }
    };

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
                <ListReservations reservations={reservations} cancelRes={cancelRes} />
            </div>
        </div>
    )
}


export default SearchReservations;