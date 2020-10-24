import {store} from "react-notifications-component"
import { Component } from "react"
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

    successDelete() {
        return store.addNotification({
            title: "Sucesso!",
            message: "Os dados foram excluídos :)",
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
    
    errorDelete() {
        return store.addNotification({
            title: "Erro!",
            message: "Não foi possível excluir!",
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
