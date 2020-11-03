import Axios from './axios'

export default class User {
  constructor() {
    this.axios = new Axios('/register')
  }

  async register(body) {
    return this.axios.post(body)
  }

  async sendMail(body) {
    return this.axios.forgotPassword(body)
  }

  async reset(body) {
    return this.axios.resetPassword(body)
  }

  async update(body, id) {
    return this.axios.update(body, id)
  }

  async getAll() {
    return this.axios.get()
  }

  async delete(id) {
    return this.axios.delete(id)
  }

}
