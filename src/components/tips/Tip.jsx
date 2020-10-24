import 'ol/ol.css'
import './Tip.css'
import React, { Component } from "react"
import {TextField} from '@material-ui/core'
import Notification from '../utils/notification'

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import Main from '../template/Main'

import TipService from '../../services/tip'

const columns = [
    { 
        id: 'title', 
        label: 'Título' 
    },
    { 
        id: 'description', 
        label: 'Descrição',
        format: (value) => value.substr(0, 30).concat('...')
    },
    {
        id: 'actions',
        label: 'Ações',
        align: 'center',
    }
];

const initialState = {
    openForm: false,
    id: undefined,
    tip: {
        title: '',
        description: ''
    },
    tips: [],
    filteredTips: [],
    page: 0,
    search: '',
    rowsPerPage: 10
}

const notification = new Notification()


class Tip extends Component {
    
    state = {...initialState}

    constructor(props) {
        super(props)
        this.tipService = new TipService()
    }

    componentDidMount() {
        this.updateList()
        this.setState({openForm: false})
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
            notification.successDelete()
        })
        .catch(()=> {
            notification.errorDelete()
        })
        this.updateList()
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

    async search(field, element) {
        console.log('aaaa', this.state.tips.filter(x => x.title.toUpperCase().includes(element.toUpperCase())))
        this.setState({search: element})        
        this.setState({filteredTips: [...this.state.tips.filter(x => x.title.toUpperCase().includes(element.toUpperCase()))]})
    }

    closeForm() {
        this.cleanFields()
        this.openForm()
    }

    renderHeader() {
        return (
                <div className={'body mb-3'}>
                {
                        !this.state.openForm &&
                    <div id="tip" className={'row'}>
                        <div className={'col-6 mt-2'}> 
                            <button className={'btn btn-primary'}
                                onClick={e => this.openForm()}>
                                Adicionar
                            </button>
                        </div>
                        <div className={'col-6'}> 
                            <div className={'form-group'}>
                                <TextField 
                                    className='col-12' 
                                    id="standard-basic"
                                    label="Pesquisar"
                                    name={'search'}
                                    value={this.state.tip.search} 
                                    onChange={e => this.search('title',e.target.value)}
                                    placeholder={'Digite o título...'}/>
                            </div>
                        </div>
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

    render() {
        console.log(this.state.search !== '')
        let array = (this.state.filteredTips.length === 0) && (this.state.search === '')? this.state.tips : this.state.filteredTips
        return (
            <Main icon={"lightbulb-o"} title={"Dicas/Sugestões"} subtitle={"Gerenciamento de dicas/sugestões para os pacientes"}>
                {this.renderHeader()}
                 <Paper >
                    <TableContainer >
                        <Table stickyHeader aria-label="sticky table" size="small">
                        <TableHead>
                            <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                key={column.id}
                                align={column.align}
                                >
                                {column.label}
                                </TableCell>
                            ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {array.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((row) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                {columns.map((column) => {
                                    const value = row[column.id];
                                    return (
                                    <TableCell key={column.id} align={column.align} className={'big-string'} title={`${value}`}>
                                        {column.id === 'actions' ? 
                                        <div>
                                            <button title={'Ver/Editar Cliente'} className={'btn btn-success ml-2'} onClick={() => this.update(row)}>
                                                <i className={'fa fa-pencil'}></i>
                                            </button>
                                            <button className={'btn btn-danger ml-2'} onClick={() => this.delete(row._id)}>
                                                <i className={'fa fa-trash'}></i>
                                            </button>
                                        </div>
                                        :  value}
                                    </TableCell>
                                    );
                                })}
                                </TableRow>
                            );
                            })}
                        </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 50]}
                        component="div"
                        count={this.state.tips.length}
                        rowsPerPage={this.state.rowsPerPage}
                        page={this.state.page}
                        onChangePage={(e, v) => this.handleChangePage(e, v)}
                        onChangeRowsPerPage={e => this.handleChangeRowsPerPage(e)}
                    />
                </Paper>
            </Main>
        )
    }
}

export default Tip
