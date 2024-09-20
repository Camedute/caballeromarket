import React from "react";
import './styles/Login.css'
import { Link } from "react-router-dom";
function Loginup(){
    return(
        <>
        <div className="Login">
            <h2>CaballeroMarket</h2>
                <br/>
            <input type="text" className="form-control" placeholder="Usuario"></input> 
                <br/>
            <input type="text" className="form-control" placeholder="Contraseña"></input>
                <br/>
            <Link to="home">
            <button className="btn btn-primary"> Acceder </button>
                </Link>
        </div>
        </>
    );
}

export default Loginup;