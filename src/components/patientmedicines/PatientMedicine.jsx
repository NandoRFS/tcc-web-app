import 'ol/ol.css'
import './Patient.css'
import React, { Component } from "react"
import {TextField} from '@material-ui/core'
import Notification from '../utils/notification'
import axios from 'axios'

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import Main from '../template/Main'

import PatientService from '../../services/patient'
import UserService from '../../services/user'
import MedicineService from '../../services/medicine'

const columns = [
    { 
        id: 'medication_id.nome', 
        label: 'Medicamento' 
    },
    { 
        id: 'dose', 
        label: 'Dose' 
    },
    { 
        id: 'pick_date', 
        label: 'Data da Retirada'
    },
    { 
        id: 'schedule_date', 
        label: 'Próxima Retirada'
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
        weight: Number,
        schedule_date: Date, //data próxima retirada
        pick_date: Date, //data em que retirou
        last_pick: Boolean
    },
	address: {
		zipcode: String,
		street: String,
		number: String,
		district: String,
		city: String,
		state: String
    },
    medication: {},
	medications: [],
    // {
    //     schedule_date: Date, //data próxima retirada
    //     pick_date: Date, //data em que retirou
    //     late: Boolean //atrasado
    // }
    histories: [],
    patients: [],
    filteredMedications: [],
    page: 0,
    search: '',
    rowsPerPage: 10,
    disableUser: false,
    statuslink: '',
    medicationId: '',
    medicines: [], // Medicamentos gerais
    editing: undefined
}

const notification = new Notification()


class Patient extends Component {
    
    state = {...initialState}

    constructor(props) {
        super(props)
        this.patientService = new PatientService()
        this.userService = new UserService()
        this.medicineService = new MedicineService()
    }

    componentDidMount() {       
        if(!this.props.location.state?.patient?._id)
            window.location.href = window.location.href.replace('patient-medicine', 'patients')
        
        this.updateList()
        this.medicineService.getAll()
        .then(resp => this.setState({medicines: [...resp.medication]}))
        this.setState({openForm: false})
    }

    handleChangePage = (event, newPage) => {
      this.setState({page: newPage});
    };
  
    handleChangeRowsPerPage = (event) => {
      this.setState({rowsPerPage: +event.target.value});
    };

    async save() {
        console.log('State: ', this.state.editing)

        try {
            if(!this.validateForm(!!this.state.id)) {
                notification.error()
            } else {

                if(this.state.editing !== undefined) {
                    let aux = this.state.patient?.medication
                    await this.setState({medication: {...this.state.medication, medication_id: this.state.medicationId}})
                    aux.splice(this.state.editing, 1, this.state.medication)
                    console.log('aaaaaa', aux)
                    await this.setState({medications: [...aux]})                             
                    this.setState({editing: undefined})
                } else {
                    await this.setState({medication: {...this.state.medication, medication_id: this.state.medicationId, last_pick: true}})
                    await this.setState({medications: [...this.state.medications.map(m => {
                        if(m.medication_id == this.state.medicationId)
                            m.last_pick = false
    
                        return m
                    }), this.state.medication]})
                }
                
                await this.setState({patient: {...this.state.patient, medication: [...this.state.medications]}})
                                
                await this.patientService.update({...this.state.patient}, this.state.patient?._id)
                                
                // this.setState({disableUser: false})
            } 

        this.updateList()
        notification.success()
        this.cleanFields()
        this.openForm()
            
        } catch(e) {
            console.log('e', e)
            if(e.error?.code == 11000)
                notification.keyValueError(Object.keys(e.error.keyValue), Object.values(e.error.keyValue))
        }
        
    }

    async update(medication, index) {
        this.setState({medication: medication})
        this.setState({medicationId: medication.medication_id})
        this.setState({editing: index})

        this.openForm()
    }

    async delete(index) {

        try {
            let aux = this.state.patient?.medication
            aux.splice(index, 1)

            await this.setState({medications: [...aux]})
            await this.setState({patient: {...this.state.patient, medication: [...this.state.medications]}})
                                    
            await this.patientService.update({...this.state.patient}, this.state.patient?._id)
            notification.successDelete()
        } catch(e) {
            notification.errorDelete()
            this.updateList()
        }
    }

    openForm() {
        this.setState({openForm: !this.state.openForm})
    }

    async updateList() {
        console.log('this.state', this.props.location.state)
        let resp = await this.patientService.get(this.props.location.state?.patient?._id)
        await this.setState({patient: {...resp.patient}})
        await this.setState({medications: [...resp.patient?.medication]})
    }

    updateField(event) {
        const patient = {...this.state.patient}
        patient[event.target.name] = event.target.value
        this.setState({patient})
    }

    updateMedicationField(event) {
        const medication = {...this.state.medication}
        medication[event.target.name] = event.target.value
        this.setState({medication})
    }

    updateHistoryField(event) {
        const history = {...this.state.history}
        history[event.target.name] = event.target.value
        this.setState({history})
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
        this.setState({filteredMedications: [...this.state.patients.filter(x => x.user.name.toUpperCase().includes(element.toUpperCase()))]})
    }

    handleChange = (event) => {
        this.setState({medicationId: event.target.value});
        console.log(this.state.medicationId)
    };

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
                        {/* <div className={'col-6'}> 
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
                        </div> */}
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
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            className='col-6' 
                                            value={this.state.medicationId}
                                            onChange={e => this.handleChange(e)}
                                            placeholder={'Selecione o medicamento...'}
                                            displayEmpty={true}
                                            >
                                            {
                                                this.state.medicines.map(m => <MenuItem value={m._id}>{m.name}</MenuItem>)
                                            }
                                        </Select>
                                            <TextField 
                                                className='col-6 ml-2' 
                                                id="standard-basic"
                                                label="Dose"
                                                name={'dose'}
                                                value={this.state.medication.dose} 
                                                onChange={e => this.updateMedicationField(e)}
                                                placeholder={'Digite a dose...'}/>
                                        </div>
                                    </div>
                                </div>
                                <div className={'row'}>
                                    <div className={'col-12'}>
                                        <div className={'form-group d-flex justify-content-center'}>
                                            <TextField 
                                                className='col-6' 
                                                id="standard-basic"
                                                label="Intervalo da medicação"
                                                name={'break_schedule'}
                                                value={this.state.medication.break_schedule} 
                                                onChange={e => this.updateMedicationField(e)}
                                                placeholder={'Digite o intervalo da medicação...'}/>
                                            <TextField 
                                                className='col-6 ml-2' 
                                                id="standard-basic"
                                                label="Modo de usar"
                                                name={'instructions'}
                                                value={this.state.medication.instructions} 
                                                onChange={e => this.updateMedicationField(e)}
                                                placeholder={'Digite o modo de usar...'}/>
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
                                                value={this.state.medication.pick_date} 
                                                onChange={e => this.updateMedicationField(e)}
                                                placeholder={'Digite a data de retirada...'}/>
                                            <TextField 
                                                className='col-6 ml-2' 
                                                id="standard-basic"
                                                label="Data da Próxima Retirada"
                                                name={'schedule_date'}
                                                value={this.state.medication.schedule_date} 
                                                onChange={e => this.updateMedicationField(e)}
                                                placeholder={'Digite a data da proxima retirada...'}/>
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
        let array = (this.state.filteredMedications.length === 0) && (this.state.search === '')? this.state.medications : this.state.filteredMedications
        console.log(array)
        return (
            <Main icon={"users"} title={`Pacientes`} subtitle={`Medicações do paciente ${this.state.patient?.user?.name}`}>
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
                            {this.state.medications.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((row, i) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                {columns.map((column) => {
                                    let value = row[column.id];

                                    if(column.id.includes('.')) {
                                        const separate = column.id.split('.')

                                        if(separate.length > 0) {
                                            // value = row[separate[0]][separate[1]]
                                            
                                            if(separate[0] === 'medication_id') {
                                                this.state.medicines.map(m => {
                                                    if(row.medication_id === m._id)
                                                        value = m.name
                                                })
                                            }   
                                        }
                                    }

                                    if(column.id === 'statuslink') {
                                        value = 'link'
                                    }

                                    return (
                                    <TableCell key={column.id} align={column.align} className={'big-string'} title={`${value}`}>
                                        {column.id === 'actions' ? 
                                        <div>
                                            <button title={'Ver/Editar Paciente'} className={'btn btn-success ml-2'} onClick={() => this.update(row, i)}>
                                                <i className={'fa fa-pencil'}></i>
                                            </button>
                                            <button className={'btn btn-danger ml-2'} onClick={() => this.delete(i)}>
                                                <i className={'fa fa-trash'}></i>
                                            </button>
                                            <button title={'Ver/Editar Medicamentos'} className={'btn btn-primary ml-2'} >
                                                <i className={'fa fa-user-md'}></i>
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
                        count={array.length}
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
