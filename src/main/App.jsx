import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'
import React from 'react'
import './App.css'
import {HashRouter} from "react-router-dom";
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

import Logo from '../components/template/Logo'
import Nav from '../components/template/Nav'
import Routes from './Routes'
import Footer from '../components/template/Footer'

export default props => {
    //Função para validar o tempo de expiração do token
    //para só então estar logado
    const auth = localStorage.getItem('token')
    console.log("passa aqui tambem por favor", !!auth)
    
    if(!auth)
        return (
            <HashRouter>
                <div className={"app"}>
                    <ReactNotification />
                    <Routes />
                </div>
            </HashRouter>
        )

    return (
        <HashRouter>
            <div className={"app"}>
                <ReactNotification />
                <Logo />
                <Nav />
                <Routes />
                <Footer />
            </div>
        </HashRouter>
    )
}