import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
import axios from "axios";

const baseUrl = process.env.REACT_APP_APIURL

export default class Axios {

    constructor(path) {
        this.token = localStorage.getItem('token')
        this.path = path
    }

    authError(e) {
        if(`${e}`.includes('401')) {
            localStorage.clear()
            window.location.reload()
            return e
        } else {
            return false
        }
    }

    async get() {
        try {
            let resp = await axios(`${baseUrl}${this.path}`, 
            {
                headers: {
                    Authorization: `Bearer ${this.token}` //the token is a variable which holds the token
                }
            })

            return resp.data
        } catch(e) {
            this.authError(e)
            throw e
        }
    }

    async getById(id) {
        try {
            let resp = await axios(`${baseUrl}${this.path}/${id}`, 
            {
                headers: {
                    Authorization: `Bearer ${this.token}` //the token is a variable which holds the token
                }
            })

            return resp.data
        } catch(e) {
            this.authError(e)
            throw e
        }
    }

    
    
    async post(body) {
        try {
            let resp = await axios['post'](`${baseUrl}${this.path}`, body, 
            {
                headers: {
                    Authorization: `Bearer ${this.token}` //the token is a variable which holds the token
                }
            })
            return resp.data
        } catch(e) {
            this.authError(e)
            throw e.response.data
        }
    }

    async update(body, id) {
        try {
            let resp = await axios['post'](`${baseUrl}${this.path}/${id}`, body, 
            {
                headers: {
                    Authorization: `Bearer ${this.token}` //the token is a variable which holds the token
                }
            })

            return resp
        } catch(e) {
            this.authError(e)
            throw e
        }
    }

    async delete(id) {
        try {
            let resp = await axios.delete(`${baseUrl}${this.path}/${id}`, 
            {
                headers: {
                    Authorization: `Bearer ${this.token}` //the token is a variable which holds the token
                }
            })
            
            return resp
        } catch(e) {
            this.authError(e)
            throw e
        }
    }

    async resetPassword(body) {
        try {
            let resp = await axios['post'](`${baseUrl}/reset-password`, body)
            return resp
        } catch(e) {
            throw e.response.data.error
        }
    }

    async forgotPassword(body) {
        try {
            let resp = await axios['post'](`${baseUrl}/forgot-password`, body)
            return resp
        } catch(e) {
            throw e.response.data.error
        }
    }
}
