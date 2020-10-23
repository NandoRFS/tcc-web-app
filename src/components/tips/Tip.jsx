import 'ol/ol.css'
import './Tip.css'
import React, { Component } from "react"
import {Button, TextField, Divider} from '@material-ui/core'
import Notification from '../utils/notification'

import Main from '../template/Main'

import TipService from '../../services/tip'

const initialState = {
    openForm: false,
    id: undefined,
    tip: {
        title: '',
        description: ''
    },
    tips: []
}

const notification = new Notification()

const baseUrl = process.env.REACT_APP_APIURL

class Tip extends Component {
    
    state = {...initialState}

    constructor(props) {
        super(props)
        this.tipService = new TipService()
    }

    componentDidMount() {
        // this.setState({tips: [{title: 'new valuse', description: 'VALUE', id: this.state.id++}]})
        this.updateList()
        this.setState({openForm: false})
    }

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

            
            this.updateList()
            notification.success()
            this.cleanFields()
            this.openForm()
        }
        
    }

    update(tip) {
        this.setState({id: tip._id})
        this.setState({tip})
        this.openForm()
    }

    delete(id) {
        this.tipService.delete(id)
        .then(() => {
            this.updateList()
            notification.success()
        })
        .catch(()=> {
            notification.error()
        })
    }

    openForm() {
        this.setState({openForm: !this.state.openForm})
        console.log(this.state.openForm)
    }

    updateList() {
        this.tipService.getAll()
        .then(resp => this.setState({tips: [...resp.tip]}))
    }

    updateField(event) {
        const tip = {...this.state.tip}
        tip[event.target.name] = event.target.value
        this.setState({tip})
    }

    cleanFields() {
        const {tip, id} = initialState
        this.setState({tip, id})
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
                <div className={'body'}>
                {
                        !this.state.openForm &&
                    <div id="tip">
                        <button className={'btn btn-primary'}
                            onClick={e => this.openForm()}>
                            Adicionar
                        </button>
                    </div>
                }


                    {
                        this.state.openForm &&
                        <div> 
                            <form noValidate autoComplete="off">
                                <div className={'row'}>
                                    <div className={'col-12'}>
                                        <div className={'form-group'}>
                                            <TextField 
                                                className='col-12' 
                                                id="standard-basic"
                                                label="Título"
                                                name={'title'}
                                                value={this.state.tip.title} 
                                                onChange={e => this.updateField(e)}
                                                placeholder={'Digite o título...'}/>
                                        </div>
                                    </div>
                                </div>
                                <div className={'row'}>
                                    <div className={'col-12'}>
                                        <div className={'form-group'}>
                                        <TextField
                                            className='col-12'
                                            id="standard-multiline-static"
                                            label="Descrição"
                                            multiline
                                            label="Descrição"
                                            name={'description'}
                                            value={this.state.tip.description} 
                                            onChange={e => this.updateField(e)}
                                            placeholder={'Digite a descrição...'}
                                        />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        
                            <div className={"d-flex justify-content-end"}> 
                                <button className={'btn btn-primary'}
                                    onClick={e => this.save()}>
                                    Salvar
                                </button>
                                <button className={'btn btn-secondary ml-2'}
                                    onClick={e => this.closeForm()}>
                                    Cancelar
                                </button>
                            </div>

                        </div>
                    }

                </div>
        );
    }

    renderTable() {
        return (
            <div>
            <table className={'table table-striped mt-4'}>
                <thead>
                <tr>
                    <th>Título</th>
                    <th>Descrição</th>
                    <th>Ações</th>
                </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
            </div>
        )
    }

    renderRows() {
        return this.state.tips.map(tip => {
        //     let color = address.mainAddress ? {'backgroundColor': '#e2c4f2'} : {}
            return (
                <tr >
                    <td>{tip.title}</td>
                    <td className='big-string' title={`${tip.description}`}>{tip.description}</td>
                    <td>
                        <button title={'Ver/Editar Cliente'} className={'btn btn-success ml-2'} onClick={() => this.update(tip)}>
                            <i className={'fa fa-pencil'}></i>
                        </button>
                        <button className={'btn btn-danger ml-2'} onClick={() => this.delete(tip._id)}>
                            <i className={'fa fa-trash'}></i>
                        </button>
                        
                    </td>
                </tr>
            )
        })
    }

    render() {
        return (
            <Main icon={"lightbulb-o"} title={"Dicas/Sugestões"} subtitle={"Gerenciamento de dicas/sugestões para os pacientes"}>
                {this.renderHeader()}
                {this.renderTable()}
            </Main>
        )
    }
}

export default Tip
