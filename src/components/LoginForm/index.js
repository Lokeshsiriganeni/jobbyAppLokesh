import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import {AiOutlineEyeInvisible} from 'react-icons/ai'

import {FaRegEye} from 'react-icons/fa'

import './index.css'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    showErrorMsg: false,
    errorMsg: '',
    showPassword: false,
  }

  changeInUserName = event => {
    this.setState({username: event.target.value})
  }

  changeInUserPassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  changeVisbility = () => {
    this.setState(prev => ({showPassword: !prev.showPassword}))
  }

  render() {
    const {showSubmitError, errorMsg, showPassword} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-form-bg">
        <form className="login-form-container" onSubmit={this.submitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo-style"
          />

          <div className="user-name-container">
            <label htmlFor="userName" className="label-style">
              USERNAME
            </label>
            <br />
            <input
              type="text"
              id="userName"
              placeholder="Username"
              onChange={this.changeInUserName}
              className="input-style"
            />
          </div>

          <div className="password-container">
            <label htmlFor="password" className="label-style">
              PASSWORD
            </label>
            <br />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Password"
              onChange={this.changeInUserPassword}
              className="password-input"
            />
            <br />
            <input
              type="checkbox"
              className="check-box-style"
              onClick={this.changeVisbility}
            />
          </div>

          <div>
            <button type="submit" className="login-btn-style">
              Login
            </button>
          </div>
          {showSubmitError && <p className="error-style">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default LoginForm
