import React from "react";
import Loginup from './login';
import CartShopping from "./cart";
import Header from "./header";
import Footer from "./footer";
import './styles/Home.css';
function Home(){
    return(
        <>
        <Header></Header>
        <h1 className="Home">Este es el componente casa</h1>

        <Loginup></Loginup>

        <CartShopping></CartShopping>
        <Footer></Footer>
        </>
    );
}

export default Home;