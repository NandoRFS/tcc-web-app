import React from 'react'
import {Switch, Route, Redirect, BrowserRouter} from 'react-router'

import Home from '../components/home/Home'
import PatientCrud from '../components/patients/PatientCrud'
import Tip from "../components/tips/Tip";
import Medicine from "../components/medicines/Medicine";
import Login from "../components/login/Login"

export default props => {
    //Função para validar o tempo de expiração do token
    //para só então estar logado
    //se espirar o tempo remover do localstorage
    const auth = localStorage.getItem('token')
    console.log("passa aqui por favor", auth)
    if(!auth)
        return (
            <Switch>
                <Route exact path={'/'} component={Login} />
                <Redirect from={'*'} to={'/'} />
            </Switch>
        )

    return (
        <Switch>
            <Route exact path={'/'} component={Home} />
            <Route path={'/patients'} component={PatientCrud} />
            <Route path={'/medicines'} component={Medicine} />
            <Route path={'/users'} component={Medicine} />
            <Route path={'/tips'} component={Tip} />
            <Redirect from={'*'} to={'/'} />
        </Switch>
    )
}