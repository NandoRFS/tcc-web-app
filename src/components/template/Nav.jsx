import './Nav.css'
import React from 'react'
import {Link} from "react-router-dom";

export default props =>
    <aside className="menu-area">
        <nav className={"menu"}>
            <Link to={"/"}>
                <i className={"fa fa-home"}></i> Dashboard
            </Link>
            <Link to={"/patients"}>
                <i className={"fa fa-users"}></i> Pacientes
            </Link>
            <Link to={"/medicines"}>
                <i className={"fa fa-medkit"}></i> Medicamentos
            </Link>
            <Link to={"/tips"}>
                <i className={"fa fa-lightbulb-o"}></i> Dicas/Sugestões
            </Link>
            {   JSON.parse(localStorage.getItem('user'))?.isAdmin &&
                <Link to={"/pharmacists"}>
                    <i className={"fa fa-user-plus"}></i> Usuários
                </Link>
            }
        </nav>
    </aside>
