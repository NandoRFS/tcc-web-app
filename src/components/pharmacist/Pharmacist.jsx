import 'ol/ol.css'
import './Pharmacist.css'
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

import PharmacistService from '../../services/pharmacist'
import UserService from '../../services/user'

const columns = [
    { 
        id: 'user.cpf', 
        label: 'CPF' 
    },
    { 
        id: 'user.name', 
        label: 'Nome' 
    },
    { 
        id: 'position', 
        label: 'Cargo/Função' 
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
    user: {
        name: '',
        email: '',
        cpf: '',
        password: ''
    },
    pharmacist: {
        user: '',
        ctps: '',
        position: '',
        birth: ''
    },
    pharmacists: [],
    filteredPharmacist: [],
    page: 0,
    search: '',
    rowsPerPage: 10,
    disableUser: false
}

const notification = new Notification()


class Pharmacist extends Component {
    
    state = {...initialState}

    constructor(props) {
        super(props)
        this.pharmacistService = new PharmacistService()
        this.userService = new UserService()
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

    async save() {
        try {
            if(!this.validateForm(!!this.state.id)) {
                notification.error()
            } else {
                let pharmacist = {...this.state.pharmacist}
                const user = {...this.state.user}

                if(!this.state.id) {
                    let resp = await this.userService.register({...user})
                    pharmacist.user = resp.user?._id
                    await this.pharmacistService.save({...pharmacist})

                } else {
                    pharmacist.user = pharmacist.user?._id
                    await this.pharmacistService.update({...pharmacist}, this.state.id)
                    this.setState({disableUser: false})
                }
                this.updateList()
                notification.success()
                this.cleanFields()
                this.openForm()
            }
        } catch(e) {
            console.log('e', e)
            if(e.error?.code == 11000)
                notification.keyValueError(Object.keys(e.error.keyValue), Object.values(e.error.keyValue))
        }
        
    }

    update(pharmacist) {
        this.setState({id: pharmacist._id})
        this.setState({pharmacist})
        this.setState({user: pharmacist.user})
        this.setState({disableUser: true})
        this.openForm()
    }

    delete(id) {
        this.pharmacistService.delete(id)
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
    }

    updateList() {
        this.pharmacistService.getAll()
        .then(resp => {
            this.setState({pharmacists: [...resp.pharmacist]})
        })
    }

    updateField(event) {
        const pharmacist = {...this.state.pharmacist}
        pharmacist[event.target.name] = event.target.value
        this.setState({pharmacist})
    }

    updateUserField(event) {
        const user = {...this.state.user}
        user[event.target.name] = event.target.value
        this.setState({user})
    }

    cleanFields() {
        const {pharmacist, id, user} = initialState
        this.setState({pharmacist, id, user})
    }

    validateForm(update) {
        const {ctps, position, birth} = this.state.pharmacist

        if(!ctps.replace(/\s/g, '').length || !position.replace(/\s/g, '').length 
        || !birth.replace(/\s/g, '').length)
            return false    

        if(!update) {
            const {name, email, cpf, password} = this.state.user

            if(!name.replace(/\s/g, '').length || !email.replace(/\s/g, '').length
            || !cpf.replace(/\s/g, '').length || !password.replace(/\s/g, '').length)
                return false 
        }
        
        return true
    }

    async search(field, element) {
        this.setState({search: element})        
        this.setState({filteredPharmacist: [...this.state.pharmacists.filter(x => x.user.name.toUpperCase().includes(element.toUpperCase()))]})
    }

    closeForm() {
        this.setState({disableUser: false})
        this.cleanFields()
        this.openForm()
    }

    renderHeader() {
        return (
                <div className={'body mb-3'}>
                {
                        !this.state.openForm &&
                    <div id="pharmacist" className={'row'}>
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
                                    value={this.state.pharmacist.search} 
                                    onChange={e => this.search('name',e.target.value)}
                                    placeholder={'Digite o nome do usuário...'}/>
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
                                        <div className={'form-group d-flex justify-content-center'}>
                                            <TextField 
                                                className='col-6' 
                                                id="standard-basic"
                                                label="Nome"
                                                name={'name'}
                                                disabled={this.state.disableUser}
                                                value={this.state.user.name} 
                                                onChange={e => this.updateUserField(e)}
                                                placeholder={'Digite o nome...'}/>
                                            <TextField 
                                                className='col-6 ml-2' 
                                                id="standard-basic"
                                                label="Email"
                                                name={'email'}
                                                disabled={this.state.disableUser}
                                                value={this.state.user.email} 
                                                onChange={e => this.updateUserField(e)}
                                                placeholder={'Digite o email...'}/>
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
                                                name={'birth'}
                                                value={this.state.pharmacist.birth} 
                                                onChange={e => this.updateField(e)}
                                                placeholder={'Digite a data de nascimento...'}/>
                                            <TextField 
                                                className='col-6 ml-2' 
                                                id="standard-basic"
                                                label="CPF"
                                                name={'cpf'}
                                                disabled={this.state.disableUser}
                                                value={this.state.user.cpf} 
                                                onChange={e => this.updateUserField(e)}
                                                placeholder={'Digite o CPF...'}/>
                                        </div>
                                    </div>
                                </div>
                                <div className={'row'}>
                                    <div className={'col-12'}>
                                        <div className={'form-group d-flex justify-content-center'}>
                                            <TextField 
                                                className='col-6' 
                                                id="standard-basic"
                                                label="CTPS"
                                                name={'ctps'}
                                                value={this.state.pharmacist.ctps} 
                                                onChange={e => this.updateField(e)}
                                                placeholder={'Digite o CTPS...'}/>
                                            <TextField 
                                                className='col-6 ml-2' 
                                                id="standard-basic"
                                                label="Cargo/Função"
                                                name={'position'}
                                                value={this.state.pharmacist.position} 
                                                onChange={e => this.updateField(e)}
                                                placeholder={'Digite o cargo ou função...'}/>
                                        </div>
                                    </div>
                                </div>
                                <div className={'row'}>
                                    <div className={'col-12'}>
                                        <div className={'form-group d-flex justify-content-right'}>
                                            <TextField 
                                                className='col-6' 
                                                id="standard-basic"
                                                label="Senha"
                                                type="password"
                                                name={'password'}
                                                disabled={this.state.disableUser}
                                                value={this.state.user.password} 
                                                onChange={e => this.updateUserField(e)}
                                                placeholder={'Digite a senha...'}/>
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
        let array = (this.state.filteredPharmacist.length === 0) && (this.state.search === '')? this.state.pharmacists : this.state.filteredPharmacist
        return (
            <Main icon={"user-plus"} title={"Usuários"} subtitle={"Gerenciamento de usuários"}>
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
                                    let value = row[column.id];

                                    if(column.id.includes('.')) {
                                        const separate = column.id.split('.')
                                        if(separate.length > 0)
                                            value = row[separate[0]][separate[1]]
                                    }

                                    return (
                                    <TableCell key={column.id} align={column.align} className={'big-string'} title={`${value}`}>
                                        {column.id === 'actions' ? 
                                        <div>
                                            <button title={'Ver/Editar Medicamento'} className={'btn btn-success ml-2'} onClick={() => this.update(row)}>
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
                        count={this.state.pharmacists.length}
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

export default Pharmacist
