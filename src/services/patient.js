import Axios from './axios'

export default class Pharmacist {
  constructor() {
    this.axios = new Axios('/patient')
  }

  async save(body) {
    return this.axios.post(body)
  }

  async update(body, id) {
    return this.axios.update(body, id)
  }

  async getAll() {
    return this.axios.get()
  }

  async get(id) {
    return this.axios.getById(id)
  }

  async delete(id) {
    return this.axios.delete(id)
  }

}
