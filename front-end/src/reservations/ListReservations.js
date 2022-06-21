import React from "react";
import { Link } from "react-router-dom";
import { updateReservationStatus } from "../utils/api";



function ListReservations({ reservations }){
    
    const cancelRes = (reservation) => {
        const abortController = new AbortController();
        if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")){
            const newStatus = {
                reservation_id: reservation.reservation_id,
                status: "cancelled"
            }
            updateReservationStatus(newStatus, abortController.signal)
        }
    }
    
    return reservations.map((reservation) => {
        let seatButtons = null;
        if(reservation.status === "booked"){
          seatButtons = (
            <div>
              <Link to={`/reservations/${reservation.reservation_id}/seat`}>
                <button style={{marginRight: "10px"}} className="btn btn-primary" 
                data-reservation-id-seat={reservation.reservation_id}><span className="oi oi-book"></span> Seat</button>
              </Link>
              <Link to={`/reservations/${reservation.reservation_id}/edit`}>
                <button style={{marginRight: "10px"}} className="btn btn-dark" 
                data-reservation-id-edit={reservation.reservation_id}><span className="oi oi-eye" ></span> Edit</button>
              </Link>
              <button style={{marginRight: "10px"}} className="btn btn-danger" 
              data-reservation-id-cancel={reservation.reservation_id} onClick={()=>{cancelRes(reservation)}}><span className="oi oi-trash"></span> Cancel</button>
            </div>
          )
        }
        return(
        <div key={reservation.reservation_id} style={{marginBottom: '10px'}}>
          <h3>{reservation.last_name}, {reservation.first_name}</h3>
          <h4>Date: {reservation.reservation_date}</h4>
          <h4>{reservation.reservation_time} For {reservation.people}</h4>
          <h3 data-reservation-id-status={reservation.reservation_id}>{reservation.status}</h3>
          <div>{seatButtons}</div>
          <hr />
        </div>
        )
      });
}


export default ListReservations;