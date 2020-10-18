import React from 'react'
import Main from '../template/Main'

export default props =>
    <Main icon={"home"} title={"Dashboard"}>
        <div className={"display-4"}> Bem Vindo! </div>
        <hr />
        <p className={"mb-0"}> Este é o sistema de gerenciamento para farmácia! </p>
    </Main>
