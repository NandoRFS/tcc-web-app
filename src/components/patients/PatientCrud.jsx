import 'ol/ol.css'
import './Patient.css'
import React, { Component } from "react"

import {TextField} from '@material-ui/core'
import Notification from '../utils/notification'
import axios from 'axios'

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import Main from '../template/Main'
import {Link} from "react-router-dom";

import PatientService from '../../services/patient'
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
        id: 'medication.pick_date', 
        label: 'Última Retirada'
    },
    { 
        id: 'statuslink', 
        label: 'Estatísticas'
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
    patient: {
        name: String,
        birth: String,
        phone_number: String,
        age: Number,
        weight: Number
    },
	address: {
		zipcode: String,
		street: String,
		number: String,
		district: String,
		city: String,
		state: String
	},
	medication: [
		{
			medication_id: '',
			dose: String,
			break_schedule: String, //intervalo intrajornada
			instructions: String,
            treatment: [],
            schedule_date: Date, //data próxima retirada
			pick_date: Date, //data em que retirou
			history: []
		}
	],
    patients: [],
    filteredPatient: [],
    page: 0,
    search: '',
    rowsPerPage: 10,
    disableUser: false,
    statuslink: '',
    openMedicine: false
}

const notification = new Notification()


class Patient extends Component {
    
    state = {...initialState}

    constructor(props) {
        super(props)
        this.patientService = new PatientService()
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

    handleOpenMedicine() {
        console.log('calling')
        this.setState({openMedicine: !this.state.openMedicine})
    }

    async save() {
        try {
            if(!this.validateForm(!!this.state.id)) {
                notification.error()
            } else {
                let patient = {...this.state.patient}
                const user = {...this.state.user}
    
                if(!this.state.id) {
                    let resp = await this.userService.register({...user})
                    patient.user = resp.user?._id
                    patient.address = {...this.state.address}
                    await this.patientService.save({...patient})
    
                } else {
                    await this.userService.update({...user}, patient.user?._id)
                    patient.user = patient.user?._id
                    await this.patientService.update({...patient}, this.state.id)
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

    update(patient) {
        console.log(patient)
        this.setState({id: patient._id})
        this.setState({patient})
        this.setState({address: patient.address})
        this.setState({user: patient.user})
        this.setState({disableUser: true})
        this.openForm()
    }

    delete(id) {
        this.patientService.delete(id)
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
        this.patientService.getAll()
        .then(resp => {
            this.setState({patients: [...resp.patient]})
        })
    }

    updateField(event) {
        const patient = {...this.state.patient}
        patient[event.target.name] = event.target.value
        this.setState({patient})
    }

    updateUserField(event) {
        const user = {...this.state.user}
        user[event.target.name] = event.target.value
        this.setState({user})
    }

    cleanFields() {
        const {patient, id, user} = initialState
        this.setState({patient, id, user})
    }

    validateForm(update) {
        // const {ctps, position, birth} = this.state.patient

        // if(!ctps.replace(/\s/g, '').length || !position.replace(/\s/g, '').length 
        // || !birth.replace(/\s/g, '').length)
        //     return false    

        // if(!update) {
        //     const {name, email, cpf, password} = this.state.user

        //     if(!name.replace(/\s/g, '').length || !email.replace(/\s/g, '').length
        //     || !cpf.replace(/\s/g, '').length || !password.replace(/\s/g, '').length)
        //         return false 
        // }
        
        return true
    }

    updateAddressField(event) {
        const address = {...this.state.address}

        const parsed = event.target.value.normalize('NFD').replace(/([\u0300-\u036f]|[^0-9])/g, '')

        if(event.target.name === 'zipcode' && parsed.length === 8) {
            axios.get(`http://viacep.com.br/ws/${parsed}/json/`)
                .then(resp  => {
                    address['zipcode'] = resp.data.cep
                    address['city'] = resp.data.localidade
                    address['state'] = resp.data.uf
                    address['district'] = resp.data.bairro
                    address['street'] = resp.data.logradouro
                    address['complement'] = resp.data.complemento

                    return this.setState({address})
                })
        }

        address[event.target.name] = event.target.value
        this.setState({address})
    }

    async search(field, element) {
        this.setState({search: element})        
        this.setState({filteredPatient: [...this.state.patients.filter(x => x.user.name.toUpperCase().includes(element.toUpperCase()))]})
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
                    <div id="patient" className={'row'}>
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
                                    value={this.state.search} 
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
                                                name={'name'}
                                                value={this.state.user.name} 
                                                onChange={e => this.updateUserField(e)}
                                                placeholder={'Digite o nome...'}/>
                                            <TextField 
                                                className='col-6 ml-2' 
                                                id="standard-basic"
                                                label="Email"
                                                name={'email'}
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
                                                value={this.state.patient.birth} 
                                                onChange={e => this.updateField(e)}
                                                placeholder={'Digite a data de nascimento...'}/>
                                            <TextField 
                                                className='col-6 ml-2' 
                                                id="standard-basic"
                                                label="CPF"
                                                name={'cpf'}
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
                                                label="Telefone"
                                                name={'phone_number'}
                                                value={this.state.patient.phone_number} 
                                                onChange={e => this.updateField(e)}
                                                placeholder={'Digite o Telefone...'}/>
                                            <TextField 
                                                className='col-3 ml-2' 
                                                id="standard-basic"
                                                label="Idade"
                                                name={'age'}
                                                type="number"
                                                value={this.state.patient.age} 
                                                onChange={e => this.updateField(e)}
                                                placeholder={'Digite o cargo ou função...'}/>
                                            <TextField 
                                                className='col-3 ml-2' 
                                                id="standard-basic"
                                                label="Peso (Kg)"
                                                type="number"
                                                name={'weight'}
                                                value={this.state.patient.weight} 
                                                onChange={e => this.updateField(e)}
                                                placeholder={'Digite o cargo ou função...'}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row pt-3 mb-2">
                                    <div className="col-12">
                                        <p className="lead mb-0">Endereço</p>
                                        <hr className="my-0" />
                                    </div>
                                </div>
                                <div className={'row'}>
                                    <div className={'col-12'}>
                                        <div className={'form-group d-flex justify-content-center'}>
                                            <TextField 
                                                className='col-6' 
                                                id="standard-basic"
                                                label="CEP"
                                                name={'zipcode'}
                                                value={this.state.address.zipcode} 
                                                onChange={e => this.updateAddressField(e)}
                                                placeholder={'Digite o nome...'}/>
                                            <TextField 
                                                className='col-6 ml-2' 
                                                id="standard-basic"
                                                label="Logradouro"
                                                name={'street'}
                                                value={this.state.address.street} 
                                                onChange={e => this.updateAddressField(e)}
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
                                                label="Número"
                                                name={'number'}
                                                value={this.state.address.number} 
                                                onChange={e => this.updateAddressField(e)}
                                                placeholder={'Digite o nome...'}/>
                                            <TextField 
                                                className='col-6 ml-2' 
                                                id="standard-basic"
                                                label="Bairro"
                                                name={'district'}
                                                value={this.state.address.district} 
                                                onChange={e => this.updateAddressField(e)}
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
                                                label="Cidade"
                                                name={'city'}
                                                value={this.state.address.city} 
                                                onChange={e => this.updateAddressField(e)}
                                                placeholder={'Digite o nome...'}/>
                                            <TextField 
                                                className='col-6 ml-2' 
                                                id="standard-basic"
                                                label="Estado"
                                                name={'state'}
                                                value={this.state.address.state} 
                                                onChange={e => this.updateAddressField(e)}
                                                placeholder={'Digite o Estado...'}/>
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
        let array = (this.state.filteredPatient.length === 0) && (this.state.search === '')? this.state.patients : this.state.filteredPatient
        return ( 
            <Main icon={"users"} title={"Pacientes"} subtitle={"Gerenciamento de pacientes"}>
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

                                        if(separate.length > 0) {
                                            value = row[separate[0]][separate[1]]
                                            
                                            // row[separate[0]][0][separate[1]] ver aqui

                                            if(separate[0] === 'medication')    
                                                value =  'N/D'
                                        }
                                    }

                                    if(column.id === 'statuslink') {
                                        value = 'link'
                                    }

                                    return (
                                    <TableCell key={column.id} align={column.align} className={'big-string'} title={`${value}`}>
                                        {column.id === 'actions' ? 
                                        <div>
                                            <button title={'Ver/Editar Paciente'} className={'btn btn-success ml-2'} onClick={() => this.update(row)}>
                                                <i className={'fa fa-pencil'}></i>
                                            </button>
                                            <button className={'btn btn-danger ml-2'} onClick={() => this.delete(row._id)}>
                                                <i className={'fa fa-trash'}></i>
                                            </button>
                                            <Link to={{
                                                pathname: "/patient-medicine",
                                                state: {
                                                    patient: row
                                                }
                                                }}>
                                                <button title={'Ver/Editar Medicamentos'} className={'btn btn-primary ml-2'} onClick={() => this.handleOpenMedicine()}>
                                                    <i className={'fa fa-user-md'}></i>
                                                </button>
                                            </Link>
                                            
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
                        count={this.state.patients.length}
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

export default Patient
