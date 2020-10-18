import React from 'react'
import {Switch, Route, Redirect} from 'react-router'

import Home from '../components/home/Home'
import PatientCrud from '../components/patients/PatientCrud'
import Tip from "../components/tips/Tip";
import Medicine from "../components/medicines/Medicine";

export default props =>
    <Switch>
        <Route exact path={'/'} component={Home} />
        <Route path={'/patients'} component={PatientCrud} />
        <Route path={'/medicines'} component={Medicine} />
        <Route path={'/users'} component={Medicine} />
        <Route path={'/tips'} component={Tip} />
        <Redirect from={'*'} to={'/'} />
    </Switch>
