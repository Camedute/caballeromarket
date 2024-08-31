import React from "react";
import Loginup from './login';
import CartShopping from "./cart";
import './styles/Home.css';
function Home(){
    return(
        <>
        <h1 className="Home">Este es el componente casa</h1>

        <Loginup></Loginup>

        <CartShopping></CartShopping>
        </>
    );
}

export default Home;