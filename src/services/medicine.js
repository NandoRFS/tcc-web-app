import Axios from './axios'

export default class Medicine {
  constructor() {
    this.axios = new Axios('/medication')
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

  async delete(id) {
    return this.axios.delete(id)
  }

}
