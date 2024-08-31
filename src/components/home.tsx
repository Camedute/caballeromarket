import React from "react";
import Loginup from './login';
import CartShopping from "./cart";
function Home(){
    return(
        <>
        <h1>Este es el componente home</h1>

        <Loginup></Loginup>

        <CartShopping></CartShopping>
        </>
    );
}

export default Home;