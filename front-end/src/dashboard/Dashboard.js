import React, { useEffect,  useState } from "react";
import { listReservations, listTables, deleteTable, createTable } from "../utils/api";
import { previous, next } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import ListReservations from "../reservations/ListReservations";
import useQuery from "../utils/useQuery"

function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [currentDate, setCurrentDate] = useState(date);
  //const [currentDateAsString, setCurrentDateAsString] = useState('');
  const [currentDateAndTime, setCurrentDateAndTime] = useState(new Date());
  const query = useQuery();

  useEffect(()=>{
    setInterval(()=>{
      setCurrentDateAndTime(new Date())
    },[1000])
  },[])
  // eslint-disable-next-line
  useEffect(loadDashboard, [currentDate]);

  function loadDashboard() {
   const abortController = new AbortController();
    setReservationsError(null);
    listReservations({date: query.date ? query.date : currentDate }, abortController.signal)
    .then((reservations) => reservations.filter((reservation)=> 
    reservation.status === "booked" || reservation.status === "seated"))
    .then((response)=>{
      response = response.filter(r=> r.reservation_date === currentDate)
      setReservations(response);
    })
    .catch(setReservationsError);
    
    listTables(abortController.signal)
    .then((response)=>{
      setTables(response);
    })
    .catch(setTablesError);
    return () => abortController.abort();
  }

  const UserCurrentDateAndTime = () => {
    return <div style={{display: "flex", justifyContent:"center", alignItems:"center"}}>
      <p style={{textDecoration: "underline"}}>Your Current Date and time is : {currentDateAndTime.toString()}</p>
    </div>
  }

  const finishTable = (table) => {
    const abortController = new AbortController();
    if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")){
      const tableValues = {
        table_name: table.table_name,
        capacity: table.capacity
      }
      deleteTable(table.table_id, abortController.signal)
      .then(() => createTable(tableValues))
      .then(() => loadDashboard())
      .catch(setTablesError)
    }
  }
  
  

  const tablesList = tables.map((table) => {
    let status = (<h4 data-table-id-status={table.table_id}>Free</h4>)
    if(table.reservation_id){
      status = (
        <div>
          <h4 data-table-id-status={table.table_id}>Occupied</h4>
          <button type= "button" className="btn btn-primary" 
          data-table-id-finish={table.table_id} onClick={()=>{finishTable(table)}}>Finish</button>
        </div>
      )
    }
    return (
    <div key={table.table_id} style={{display:'flex', justifyContent:'space-between', marginBottom: '10px'}}>
      <h3>{table.table_name}</h3>
      <h6>Capacity {table.capacity}</h6>
      {status}
    </div>
    )
  });


  return (
    <main>
      <UserCurrentDateAndTime/>
      <div style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px"}}>
        <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
          <button type="button" className="btn btn-default btn-lg"><span className="oi oi-chevron-left" onClick={()=>{setCurrentDate(previous(currentDate))}}></span></button>
          <h2 style={{display: "flex", justifyContent: "center", width: "200px"}} >{currentDate}</h2>
          <button type="button" className="btn btn-default btn-lg"><span className="oi oi-chevron-right" onClick={()=>{setCurrentDate(next(currentDate))}}></span></button>
        </div>
      </div>
      <h1>Dashboard</h1>
      <div className="container" style={{display: "flex", flexDirection: "row"}}>
        <div className="col">
          <h4 className="mb-0">Reservations</h4>
          <hr />
          <ErrorAlert error={reservationsError} />
          <ListReservations reservations={reservations} />
        </div>
        <div className="col">
          <h4 className="mb-0">Tables</h4>
          <hr />
          <ErrorAlert error={tablesError} />
          <div>{tablesList}</div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
