import './Header.css'
import React from 'react'
import Button from '@material-ui/core/Button'
import {AccountCircle} from '@material-ui/icons'

export default props => {
    const user = JSON.parse(localStorage.getItem('user'))
    console.log(user)
    return (
        <header className={"header d-none d-sm-flex flex-column"}>
            <h1 className={"mt-3"}>
                <i className={`fa fa-${props.icon}`}></i> {props.title}
                <span className="float-right">
                    <Button title={`Acessar perfil de ${user.name}`} variant="outlined" startIcon={<AccountCircle />}>
                        <h6 className="big-string mb-0 pb-0">{user.name}</h6>
                    </Button>
                </span>
            </h1>
            <p className={"lead text-muted"}>{props.subtitle}</p>
        </header>
    )
}