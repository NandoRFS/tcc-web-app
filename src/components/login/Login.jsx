import './Login.css'
import React, { Component } from "react"
import {Button, TextField, Divider} from '@material-ui/core'
import Notification from '../utils/notification'

import Main from '../template/Main'

const initialState = {
    openForm: false,
    id: 0 ,
    user: {
        cpf: '',
        password: ''
    },
    tips: []
}

const notification = new Notification()

const baseUrl = process.env.REACT_APP_APIURL

class Tip extends Component {
    
    state = {...initialState}

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        // this.setState({tips: [{title: 'new valuse', description: 'VALUE', id: this.state.id++}]})
        this.setState({openForm: false})
    }

    login() {
        //Fazer login /authenticate e setar o token
        //de response para usar como header no axiosService.js
        //para rotas que precisam estar autenticadas
        localStorage.setItem('token','blablablahihihi')
        window.location.reload()
    }

    render() {
        return (
            <div>
                <div class="materialContainer">

                <div class="box">

                <div className={"d-flex justify-content-center title"}>LOGIN</div>

                <div> 
                        <form noValidate autoComplete="off">
                            <div className={'row'}>
                                <div className={'col-12'}>
                                    <div className={'form-group'}>
                                        <TextField 
                                            className='col-12' 
                                            id="standard-basic"
                                            label="CPF"
                                            name={'cpf'}
                                            value={this.state.user.cpf} 
                                            onChange={e => this.updateField(e)}
                                            placeholder={'Digite o CPF...'}/>
                                    </div>
                                </div>
                            </div>
                            <div className={'row'}>
                                <div className={'col-12'}>
                                    <div className={'form-group'}>
                                    <div className={'form-group'}>
                                        <TextField 
                                            className='col-12' 
                                            id="standard-basic"
                                            label="Senha"
                                            name={'password'}
                                            value={this.state.user.password} 
                                            onChange={e => this.updateField(e)}
                                            placeholder={'Digite a senha...'}/>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    
                        <div className={"d-flex justify-content-center mb-4 mt-2"}> 
                            <button className={'btn btn-primary'}
                                onClick={e => this.login()}>
                                Entrar
                            </button>
                        </div>

                    </div>

                <a href="" class="pass-forgot">Forgot your password?</a>

                </div>

                </div>
            </div>
        )
    }
}

export default Tip
