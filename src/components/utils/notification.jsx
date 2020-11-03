import {store} from "react-notifications-component"
import { Component } from "react"
import 'react-notifications-component/dist/theme.css';

export default class Notifications extends Component {

    success() {
        store.addNotification({
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

    successMail() {
        store.addNotification({
            title: "Email enviado!",
            message: "Verifique sua caixa de entrada :)",
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

    errorMail() {
        store.addNotification({
            title: "Erro!",
            message: "Serviço indisponível no momento :( tente novamente mais tarde!",
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

    errorMessage(m) {
        store.addNotification({
            title: "Erro!",
            message: `${m}`,
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

    errorDiffPassword() {
        store.addNotification({
            title: "Erro!",
            message: "A senha e confirmação são diferentes :( tente novamente!",
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

    errorReset(e) {
        if(e === 'Inválid token!')
            store.addNotification({
                title: "Erro!",
                message: "Token inválido :( verifique o token enviado a seu email",
                type: "danger",
                insert: "top",
                container: "top-right",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {
                    duration: 5000,
                    onScreen: true
                }
            })

        this.errorMail()
    }
    
    error() {
        store.addNotification({
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
        store.addNotification({
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
        store.addNotification({
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

    keyValueError(key, value) {
        store.addNotification({
            title: "Erro!",
            message: `${key} ${value} já existente, altere ou consulte já cadastrados`,
            type: "danger",
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

}
