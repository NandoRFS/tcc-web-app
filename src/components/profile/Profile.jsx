import 'ol/ol.css'
import './Profile.css'
import React, { Component } from "react"
import {TextField} from '@material-ui/core'
import Notification from '../utils/notification'

import Main from '../template/Main'

import PharmacistService from '../../services/pharmacist'
import UserService from '../../services/user'

const initialState = {
    id: undefined,
    pharmacist: {},
    user: {},
    password: {
        new: '',
        newConfirm: '',
        old: '',
        token: ''
    },
    request: false
}

const notification = new Notification()


class Tip extends Component {
    
    state = {...initialState}

    constructor(props) {
        super(props)
        this.pharmacistService = new PharmacistService()
        this.userService = new UserService()
    }

    componentDidMount() {
        this.setState({user: JSON.parse(localStorage.getItem('user'))})

        this.pharmacistService.getByUser(JSON.parse(localStorage.getItem('user'))._id).then(resp => {
            this.setState({pharmacist: resp.pharmacist})
        })
    }

    handleChangePage = (event, newPage) => {
      this.setState({page: newPage});
    };
  
    handleChangeRowsPerPage = (event) => {
      this.setState({rowsPerPage: +event.target.value});
    };

    save() {

        if(!this.validateForm()) {
            notification.error()
        } else {
            const tip = {title: this.state.tip?.title, description: this.state.tip?.description}

            if(!this.state.id) {
                this.tipService.save({...tip})
            } else {
                this.tipService.update({...tip}, this.state.id)
            }
            
            notification.success()
            this.cleanFields()
        }
        
    }

    update(tip) {
        this.setState({id: tip._id})
        this.setState({tip})
    }

    delete(id) {
        this.tipService.delete(id)
        .then(() => {
            notification.successDelete()
        })
        .catch(()=> {
            notification.errorDelete()
        })
    }

    openForm() {
        this.setState({request: !this.state.request})
    }

    changePassword() {
        this.userService.sendMail({cpf: this.state.pharmacist.user.cpf})
        .then(resp => {
            notification.successMail()
            this.openForm()
        })
        .catch(e => {
            notification.errorMail()
        })
        
    }

    changePasswordConfirm() {
        const {password} = this.state
        console.log('password: ', password)
        if(password.new === password.newConfirm) {
            const body = {
                cpf: this.state.pharmacist?.user?.cpf,
                token: password.token,
                password: password.new
            }

            this.userService.reset(body)
            .then(resp => {
                notification.success()
            })
            .catch(e => {
                notification.errorReset(e)
            })

            this.openForm()

        } else {
            notification.errorDiffPassword()
        }
        
    }

    updatePasswordField(event) {
        const password = {...this.state.password}
        password[event.target.name] = event.target.value
        this.setState({password})
    }

    cleanFields() {
        const {password, id} = initialState
        this.setState({password, id})
    }

    validateForm() {
        const {title, description} = this.state.tip

        if(!title.replace(/\s/g, '').length || !description.replace(/\s/g, '').length)
            return false

        return true
    }

    closeForm() {
        this.cleanFields()
        this.openForm()
    }

    renderHeader() {
        return (
                <div className={'body mb-3'}>
                        <div> 
                            <form noValidate autoComplete="off">
                            <div className="row pt-3 mb-2">
                                    <div className="col-12">
                                        <p className="lead mb-0">Informações Pessoais</p>
                                        <hr className="my-0" />
                                    </div>
                                </div>
                                <div className={'row'}>
                                    <div className={'col-12'}>
                                        <div className={'form-group d-flex justify-content-center'}>
                                            <TextField 
                                                className='col-6' 
                                                id="standard-basic"
                                                label="Nome"
                                                name={'name1'}
                                                disabled
                                                value={this.state.pharmacist?.user?.name} 
                                                onChange={e => this.updatePasswordField(e)}
                                                placeholder={'Digite a data de retirada...'}/>
                                            <TextField 
                                                className='col-6 ml-2' 
                                                id="standard-basic"
                                                label="E-mail1"
                                                name={'email'}
                                                disabled
                                                value={this.state.pharmacist?.user?.email} 
                                                onChange={e => this.updatePasswordField(e)}
                                                placeholder={'Digite a data da proxima retirada...'}/>
                                        </div>
                                    </div>
                                </div>
                                <div className={'row'}>
                                    <div className={'col-12'}>
                                        <div className={'form-group d-flex justify-content-center'}>
                                            <TextField 
                                                className='col-6' 
                                                id="standard-basic"
                                                label="Data de Nascimento"
                                                name={'pick_date'}
                                                disabled
                                                value={this.state.pharmacist?.birth} 
                                                onChange={e => this.updatePasswordField(e)}
                                                placeholder={'Digite a data de retirada...'}/>
                                            <TextField 
                                                className='col-6 ml-2' 
                                                id="standard-basic"
                                                label="CPF"
                                                name={'schedule_date'}
                                                disabled
                                                value={this.state.pharmacist?.user?.cpf} 
                                                onChange={e => this.updatePasswordField(e)}
                                                placeholder={'Digite a data da proxima retirada...'}/>
                                        </div>
                                    </div>
                                </div>
                                <div className={'row'}>
                                    <div className={'col-12'}>
                                        <div className={'form-group d-flex justify-content-center'}>
                                            <TextField 
                                                className='col-6' 
                                                id="standard-basic"
                                                label="Data de Retirada"
                                                name={'pick_date'}
                                                disabled
                                                value={this.state.pharmacist?.ctps} 
                                                onChange={e => this.updatePasswordField(e)}
                                                placeholder={'Digite a data de retirada...'}/>
                                            <TextField 
                                                className='col-6 ml-2' 
                                                id="standard-basic"
                                                label="Data da Próxima Retirada"
                                                name={'schedule_date'}
                                                disabled
                                                value={this.state.pharmacist?.position} 
                                                onChange={e => this.updatePasswordField(e)}
                                                placeholder={'Digite a data da proxima retirada...'}/>
                                        </div>
                                    </div>
                                </div>
                                {
                                    !this.state.request && 
                                    <div className={'mt-2'}> 
                                        <button className={'btn btn-primary'}
                                            onClick={e => this.changePassword()}>
                                            Alterar Senha
                                        </button>
                                    </div>
                                }
                                {
                                    !!this.state.request && 
                                    <div>
                                        <div className="row pt-3 mb-2">
                                            <div className="col-12">
                                                <p className="lead mb-0">Alterar Senha</p>
                                                <hr className="my-0" />
                                            </div>
                                        </div>
                                        <div className={'row'}>
                                            <div className={'col-12'}>
                                                <div className={'form-group d-flex justify-content-center'}>
                                                    <TextField 
                                                        className='col-6' 
                                                        id="standard-basic"
                                                        label="Nova Senha"
                                                        type="password"
                                                        name={'new'}
                                                        value={this.state.password.new} 
                                                        onChange={e => this.updatePasswordField(e)}
                                                        placeholder={'Digite a nova senha...'}/>
                                                    <TextField 
                                                        className='col-6 ml-2' 
                                                        id="standard-basic"
                                                        label="Confirmar nova senha"
                                                        type="password"
                                                        name={'newConfirm'}
                                                        value={this.state.password.newConfirm} 
                                                        onChange={e => this.updatePasswordField(e)}
                                                        placeholder={'Digite a nova senha...'}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={'row'}>
                                            <div className={'col-12'}>
                                                <div className={'form-group d-flex justify-content-left'}>
                                                    <TextField 
                                                        className='col-6' 
                                                        id="standard-basic"
                                                        label="Token (enviado para seu e-mail)"
                                                        name={'token'}
                                                        value={this.state.password.token} 
                                                        onChange={e => this.updatePasswordField(e)}
                                                        placeholder={'Digite o token enviado por email...'}/></div>
                                            </div>
                                        </div>
                                        <div className={"d-flex justify-content-end"}> 
                                            <button className={'btn btn-primary'}
                                                onClick={e => this.changePasswordConfirm()}>
                                                Salvar
                                            </button>
                                            <button className={'btn btn-secondary ml-2'}
                                                onClick={e => this.closeForm()}>
                                                Cancelar
                                            </button>
                                        </div>                                
                                    </div>
                                }
                                
                            </form>
                        </div>
                </div>
        );
    }

    render() {
        return (
            <Main icon={"user-circle-o"} title={"Perfil"} subtitle={`${this.state.user?.name}`}>
                {this.renderHeader()}
            </Main>
        )
    }
}

export default Tip
