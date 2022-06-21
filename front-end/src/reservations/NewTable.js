import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function NewTable(){
    const history = useHistory();
    const initialFormState = {
        table_name: "",
        capacity: ""
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
        const t_capacity = parseInt(formData.capacity)
        createTable({...formData, capacity: t_capacity})
        .then(() => history.push("/dashboard"))
        .catch(setFormError)
    }
    
    return(
        <div>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: "20px 0"}}>
                <h1>Create Table</h1>
            </div>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <form onSubmit={submitHandler} style={{display: "flex", flexDirection: "column", padding: "0 40px"}}>
                    <div>
                        <label style={{display: "flex", justifyContent: "space-between"}}>Table Name
                            <input id="table_name" type="text" name="table_name" value={formData.table_name} onChange={handleChange} style={{marginLeft: "40px"}}/>
                        </label>
                        <label style={{display: "flex", justifyContent: "space-between"}}>Capacity
                            <input id="capacity" type="number" min="1" name="capacity" value={formData.capacity} onChange={handleChange} style={{marginLeft: "40px"}}/>
                        </label>
                    </div>
                    <ErrorAlert error={formError} />
                    <div style={{display: "flex", justifyContent: "space-evenly", marginTop: "10px"}}>
                        <button type="button" className="btn btn-dark" onClick={()=>history.goBack()}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Submit</button>                    
                    </div>
                </form>
            </div>
        </div>
    )
}


export default NewTable;