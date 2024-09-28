import React from "react";
import Loginup from './login';
import Header from "./header";
import Footer from "./footer";
import './styles/Home.css';
import NavBar from "./navBar";
function Home(){
    return(
        <>
        <body>
            <Header></Header>
            <h1 className="Home">Este es el componente casa</h1>

            <Loginup></Loginup>
            <Footer></Footer>
        </body>
        </>
    );
}

export default Home;