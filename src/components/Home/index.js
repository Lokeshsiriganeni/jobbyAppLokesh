import {Link, Redirect} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = props => {
  const redirectToJobs = () => {
    const {history} = props
    history.replace('/jobs')
  }

  return (
    <div className="home-container">
      <Header />
      <div className="app-info-container">
        <h1 className="app-info-heading">Find The Job That Fits Your Life</h1>
        <p>
          Millions of people are searching for jobs,salary information, company
          reviews.Find the job that fits your abilities and potential.
        </p>
        <Link to="/jobs">
          <button type="button" className="btn-style" onClick={redirectToJobs}>
            Find Jobs
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Home
