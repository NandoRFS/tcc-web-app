import 'ol/ol.css'
import './Tip.css'
import React, { Component } from "react"
import {Button, TextField, Divider} from '@material-ui/core'

import Main from '../template/Main'

class Tip extends Component {
    constructor(props) {
        super(props)

        this.state = { 
            openForm: false, 
            zoom: 14 ,
            user: {
                name: '',
                email: '',
                cpf: '',
                phone: '',
                addresses: []
            }
        }
    }
    componentDidMount() {

        this.setState({openForm: false})

    }

    openForm() {
        this.setState({openForm: !this.state.openForm})
        console.log(this.state.openForm)
    }

    updateField(event) {
        const user = {...this.state.user}
        user[event.target.name] = event.target.value
        this.setState({user})
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
                                            <TextField className='col-12' id="standard-basic" label="Título" />
                                            {/* <label>Nome</label>
                                            <input type={'text'} className={'form-control'} name={'name'}
                                                value={this.state.user?.name}
                                                onChange={e => this.updateField(e)}
                                                placeholder={'Digite o nome...'} /> */}
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
                                            //   defaultValue="Default Value"
                                        />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        
                            <div className={"d-flex justify-content-end"}> 
                                <button className={'btn btn-primary'}
                                    onClick={e => this.openForm()}>
                                    Salvar
                                </button>
                                <button className={'btn btn-secondary ml-2'}
                                    onClick={e => this.openForm()}>
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
        // return this.state.addresses.map(address => {
        //     let color = address.mainAddress ? {'backgroundColor': '#e2c4f2'} : {}
            return (
                <tr key={'address.id'}>
                    <td>A</td>
                    <td>A</td>
                    <td>
                        <button className={'btn btn-danger ml-2'} onClick={() => this.removeAddress()}>
                            <i className={'fa fa-trash'}></i>
                        </button>
                    </td>
                </tr>
            )
        // })
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
