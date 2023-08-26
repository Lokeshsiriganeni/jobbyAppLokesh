import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import {FiLogOut} from 'react-icons/fi'
import {AiFillHome} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'
import './index.css'

const Header = props => {
  const logoutClicked = () => {
    const jwtToken = Cookies.remove('jwt_token')
    const {history} = props
    history.replace('./login')
  }

  return (
    <nav className="header-style">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="logo-style"
        />
      </Link>
      <div className="nav-container-lg">
        <Link to="/" className="link-style">
          Home
        </Link>
        <Link to="/jobs" className="link-style">
          Jobs
        </Link>
        <button className="logout-btn" onClick={logoutClicked}>
          Logout
        </button>
      </div>

      <div className="nav-container-sm">
        <Link to="/">
          <AiFillHome fill="white" className="sm-nav-icon" />
        </Link>
        <Link to="/jobs">
          <BsBriefcaseFill fill="white" className="sm-nav-icon" />
        </Link>
        <FiLogOut
          fill="white"
          className="sm-nav-icon"
          onClick={logoutClicked}
        />
      </div>
    </nav>
  )
}

export default withRouter(Header)
