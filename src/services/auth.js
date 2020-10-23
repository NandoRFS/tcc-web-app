import Axios from './axios'

export default class Auth {
  constructor() {
    this.axios = new Axios('/authenticate')
  }

  async authenticate(body) {
    return this.axios.post(body)
  }

}
