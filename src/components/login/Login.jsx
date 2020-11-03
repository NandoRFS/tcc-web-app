import './Login.css'
import React, { Component } from "react"
import {Button, TextField, Divider} from '@material-ui/core'
import Notification from '../utils/notification'

import Main from '../template/Main'

import Auth from '../../services/auth'
import UserService from '../../services/user'

const initialState = {
    openForm: false,
    id: 0 ,
    user: {
        cpf: '',
        password: ''
    },
    tips: [],
    password: {
        new: '',
        newConfirm: '',
        old: '',
        token: ''
    },
    forgotMenu: false,
    newPass: false
}

const notification = new Notification()

const baseUrl = process.env.REACT_APP_APIURL

class Tip extends Component {
    
    state = {...initialState}

    constructor(props) {
        super(props)
        this.authService = new Auth()
        this.userService = new UserService()
    }

    componentDidMount() {
        // this.setState({tips: [{title: 'new valuse', description: 'VALUE', id: this.state.id++}]})
        this.setState({openForm: false})
    }
    
    updateField(event) {
        const user = {...this.state.user}
        user[event.target.name] = event.target.value
        this.setState({user})
    }

    sendMail() {
        this.userService.sendMail({cpf: this.state.user.cpf})
            .then(() => {
                notification.successMail()
                this.handleNewPass()
            })
            .catch(e => {
                if(e == 'User not found!')
                    notification.errorMessage('Usuário não encontrado :(')
                else 
                    notification.errorMail()
            })
    }

    changePasswordConfirm() {
        const {password} = this.state
        if(password.new === password.newConfirm) {
            const body = {
                cpf: this.state.user?.cpf,
                token: password.token,
                password: password.new
            }

            this.userService.reset(body)
            .then(resp => {
                notification.success()
                this.handleMenu()
                this.handleNewPass()
            })
            .catch(e => {
                notification.errorReset(e)
            })

        } else {
            notification.errorDiffPassword()
        }
        
    }

    handleMenu() {
        this.setState({forgotMenu: !this.state.forgotMenu})
    }

    handleNewPass() {
        this.setState({newPass: !this.state.newPass})
    }

    updatePasswordField(event) {
        const password = {...this.state.password}
        password[event.target.name] = event.target.value
        this.setState({password})
    }

    login() {
        //Fazer login /authenticate e setar o token
        //de response para usar como header no axiosService.js
        //para rotas que precisam estar autenticadas
        this.authService.authenticate(this.state.user)
            .then(resp => {
                localStorage.setItem('user', JSON.stringify(resp.user))
                localStorage.setItem('token', resp.token)
                window.location.reload()
            })
            .catch(e => {
                console.log(e)
                notification.errorMessage('Usuário ou senha inválidos!')
            })
        // window.location.reload()
    }

    render() {
        return (
            <div>
                <div class="materialContainer">

                <div class="box">
                
                {   !this.state.forgotMenu && !this.state.newPass &&
                    <div>
                    <div className={"d-flex justify-content-center title"}>
                        LOGIN
                    </div>

                    <div> 
                            <form noValidate autoComplete="true">
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
                                                type="password"
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
                        <button 
                            type="button" 
                            class="btn btn-link pass-forgot"
                            onClick={() => this.handleMenu()}    
                        >
                            Esqueceu sua senha?
                        </button>
                    </div>
                }
                {/* FORGOT MENU */}
                {   !!this.state.forgotMenu && !this.state.newPass &&
                    <div>
                    <div className={"d-flex justify-content-center title"}>
                        RUCUPERAÇÃO DE SENHA
                    </div>

                    <div> 
                            <form noValidate autoComplete="true">
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
                            </form>
                        
                            <div className={"d-flex justify-content-center mb-4 mt-2"}> 
                                <button className={'btn btn-primary'}
                                    onClick={e => this.sendMail()}>
                                    Seguinte
                                </button>
                            </div>

                        </div>

                    </div>
                }
                {/* END FORGOT MENU */}
                {/* NEW PASS MENU */}
                {   !!this.state.forgotMenu && !!this.state.newPass &&
                    <div>
                    <div className={"d-flex justify-content-center title"}>
                        NOVA SENHA
                    </div>

                    <div> 
                            <form noValidate autoComplete="true">
                                <div className={'row'}>
                                    <div className={'col-12'}>
                                        <div className={'form-group'}>
                                            <TextField 
                                                className='col-12' 
                                                id="standard-basic"
                                                label="Nova senha"
                                                name={'new'}
                                                type="password"
                                                value={this.state.password.new} 
                                                onChange={e => this.updatePasswordField(e)}
                                                placeholder={'Digite a nova senha...'}/>
                                            <TextField 
                                                className='col-12' 
                                                id="standard-basic"
                                                label="Repetir senha"
                                                name={'newConfirm'}
                                                type="password"
                                                value={this.state.password.newConfirm} 
                                                onChange={e => this.updatePasswordField(e)}
                                                placeholder={'Repita a nova senha...'}/>
                                            <TextField 
                                                className='col-12' 
                                                id="standard-basic"
                                                label="Token (enviado para o email cadastrado)"
                                                name={'token'}
                                                value={this.state.password.token} 
                                                onChange={e => this.updatePasswordField(e)}
                                                placeholder={'Digite o token...'}/>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        
                            <div className={"d-flex justify-content-center mb-4 mt-2"}> 
                                <button className={'btn btn-primary'}
                                    onClick={e => this.changePasswordConfirm()}>
                                    Seguinte
                                </button>
                            </div>

                        </div>

                    </div>
                }
                {/* NEW PASS MENU */}
                </div>

                </div>
            </div>
        )
    }
}

export default Tip
