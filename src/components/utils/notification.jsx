import {store} from "react-notifications-component"
import React, { Component } from "react"
import 'react-notifications-component/dist/theme.css';

export default class Notifications extends Component {

    success() {
        return store.addNotification({
            title: "Sucesso!",
            message: "Os dados foram salvos :)",
            type: "success",
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
                duration: 4000,
                onScreen: true
            }
        })
    }
    
    error() {
        return store.addNotification({
            title: "Erro!",
            message: "Não foi possível alterar :( verifique os campos e tente novamente!",
            type: "danger",
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
                duration: 2500,
                onScreen: true
            }
        })
    }

}
