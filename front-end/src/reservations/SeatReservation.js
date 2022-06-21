import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { readReservation, listTables, updateTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";



function SeatReservation(){
    const history = useHistory();
    const { reservation_id } = useParams();
    const [reservation, setReservation] = useState({});
    const [tables, setTables] = useState([]);
    const [tableToUpdate, setTableToUpdate] = useState({})
    const [formError, setFormError] = useState(null);
    
    useEffect(()=>{
        async function loadReservation() {
            const abortController = new AbortController();
            const reservationFromAPI = await readReservation(reservation_id);
            setReservation(reservationFromAPI);
            const tablesFromAPI = await listTables();
            setTables(tablesFromAPI);
            return () => abortController.abort();
        };
        loadReservation();
    }, [reservation_id]);

    const tableOptions = 
        tables
            .filter((table) => !table.reservation_id)
            .map((table) => (<option key ={table.table_id} value={table.table_id}>{table.table_name} - {table.capacity}</option>));
    
    const handleChange = ({ target }) => {
        setTableToUpdate(target.value);
    };

    const submitHandler = (event) => {
        event.preventDefault();
        const updatedTable = {
            table_id: tableToUpdate,
            reservation_id: reservation.reservation_id
        }
        updateTable(updatedTable)
        .then(() => history.push("/dashboard"))
        .catch(setFormError)
    }
    
    return(
        <div>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: "20px 0"}}>
                <h1>Seat Reservation for {reservation.first_name} {reservation.last_name}</h1>
            </div>                
            <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <h3>{reservation.people} People</h3>
            </div>
            <ErrorAlert error={formError} />
            <div style={{marginTop: "80px"}}>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <label htmlFor="table-select">Table number:</label>
                    <select name="table_id" id="table-select" style={{marginLeft: "10px"}} onChange={handleChange}>
                        <option value="DEFAULT" disabled>--Please choose a table--</option>
                        {tableOptions}
                    </select>
                </div>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <button type="button" className="btn btn-dark" style={{margin: "10px"}} onClick={()=>history.goBack()}>Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{margin: "10px"}} onClick={submitHandler}>Submit</button>                    
                </div>
            </div>
        </div>
    )
}


export default SeatReservation;