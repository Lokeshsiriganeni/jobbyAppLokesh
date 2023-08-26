import {Component} from 'react'
import {AiOutlineSearch} from 'react-icons/ai'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import JobCard from '../JobCard'
import './index.css'

const employmentTypeList = [
  {label: 'Full Time', employmentTypeId: 'FULLTIME'},
  {label: 'Part Time', employmentTypeId: 'PARTTIME'},
  {label: 'Freelance', employmentTypeId: 'FREELANCE'},
  {label: 'Internship', employmentTypeId: 'INTERNSHIP'},
]

const salaryRangeList = [
  {salaryRangeId: '1000000', label: '10 LPA and above'},
  {salaryRangeId: '2000000', label: '20 LPA and above'},
  {salaryRangeId: '3000000', label: '30 LPA and above'},
  {salaryRangeId: '4000000', label: '40 LPA and above'},
]
const apiStatusConstants = {
  intial: 'INTIAL',
  failure: 'FAILURE',
  success: 'SUCCESS',
  inProgress: 'IN PROGRESS',
}

const apiJobStatusConstants = {
  intial: 'INTIAL',
  failure: 'FAILURE',
  success: 'SUCCESS',
  inProgress: 'IN PROGRESS',
}

class AllJobs extends Component {
  state = {
    jobsData: [],
    profilesData: [],
    checkBoxInput: [],
    radioBtnInput: '',
    searchInput: '',
    apiStatus: apiStatusConstants.intial,
    apiJobStatus: apiJobStatusConstants.intial,
  }

  componentDidMount() {
    this.getJobDetails()
    this.getProfileDetails()
  }

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {radioBtnInput, searchInput, checkBoxInput} = this.state

    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${checkBoxInput}&minimum_package=${radioBtnInput}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()

      const updatedData = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))

      this.setState({
        jobsData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  getProfileDetails = async () => {
    this.setState({apiJobStatus: apiJobStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }

      this.setState({
        apiJobStatus: apiJobStatusConstants.success,
        profilesData: updatedData,
      })
    } else {
      this.setState({apiJobStatus: apiJobStatusConstants.failure})
    }
  }

  renderProfileView = () => {
    const {profilesData} = this.state

    const {name, profileImageUrl, shortBio} = profilesData
    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  renderProfileOnFailure = () => (
    <div>
      <button className="failure-btn" onClick={this.clickedProfileRetryBtn}>
        Retry
      </button>
    </div>
  )

  profileContainer = () => {
    const {apiJobStatus} = this.state
    switch (apiJobStatus) {
      case 'SUCCESS':
        return this.renderProfileView()
      case 'FAILURE':
        return this.renderProfileOnFailure()

      default:
        return null
    }
  }

  getInputCheckBox = event => {
    const {checkBoxInput} = this.state
    const clickedCheckBox = checkBoxInput.filter(
      eachCheckBox => eachCheckBox === event.target.id,
    )

    if (clickedCheckBox.length === 0) {
      this.setState(
        prevState => ({
          checkBoxInput: [...prevState.checkBoxInput, event.target.id],
        }),
        this.getJobDetails,
      )
    } else {
      const filteredData = checkBoxInput.filter(
        eachBox => eachBox !== event.target.id,
      )

      this.setState({checkBoxInput: filteredData}, this.getJobDetails)
    }
  }

  onGetRadioOption = event => {
    this.setState({radioBtnInput: event.target.id}, this.getJobDetails)
  }

  checkBoxContainer = () => (
    <ul className="check-box-container">
      {employmentTypeList.map(eachType => (
        <li className="eachCheckBox" key={eachType.employmentTypeId}>
          <input
            type="checkbox"
            id={eachType.employmentTypeId}
            onChange={this.getInputCheckBox}
          />
          <label htmlFor={eachType.employmentTypeId} className="label-style">
            {eachType.label}
          </label>
        </li>
      ))}
    </ul>
  )

  radioBtnContainer = () => (
    <ul className="radio-btn-container">
      {salaryRangeList.map(eachSalary => (
        <li key={eachSalary.salaryRangeId}>
          <input
            type="radio"
            name="option"
            id={eachSalary.salaryRangeId}
            onChange={this.onGetRadioOption}
          />
          <label htmlFor={eachSalary.salaryRangeId} className="label-style">
            {eachSalary.label}
          </label>
        </li>
      ))}
    </ul>
  )

  renderSuccessView = () => {
    const {jobsData} = this.state

    const noData = jobsData.length === 0
    return noData ? (
      <div className="no-jobs-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png "
          alt="no jobs"
          className="no-jobs-img"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs. Try other filters</p>
      </div>
    ) : (
      <ul className="unListed-container">
        {jobsData.map(eachJobDetails => (
          <JobCard eachJobDetails={eachJobDetails} key={eachJobDetails.id} />
        ))}
      </ul>
    )
  }

  clickedRetryBtn = () => {
    this.getJobDetails()
  }

  clickedProfileRetryBtn = () => {
    this.getProfileDetails()
  }

  renderFailureView = () => (
    <div className="failure-image-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for </p>
      <button className="failure-btn" onClick={this.clickedRetryBtn}>
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderBasedOnStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case 'SUCCESS':
        return this.renderSuccessView()
      case 'FAILURE':
        return this.renderFailureView()
      case 'IN PROGRESS':
        return this.renderLoadingView()
      default:
        return null
    }
  }

  enterSearch = event => {
    if (event.key === 'Enter') {
      this.getJobDetails()
    }
  }

  onChangeInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSubmitSearch = () => {
    this.getJobDetails()
  }

  render() {
    const {jobsData, profilesData, checkBoxInput} = this.state

    return (
      <>
        <Header />
        <div className="large-view">
          <div className="all-jobs-container">
            <div className="profile-container-lg">
              {this.profileContainer()}
              <hr />
              <h1 className="heading">Type of Employment</h1>
              {this.checkBoxContainer()}
              <hr />
              <h1 className="heading">Salary Range</h1>
              {this.radioBtnContainer()}
            </div>
            <div className="job-container">
              <div>
                <input
                  type="search"
                  className="input-search-style"
                  onChange={this.onChangeInput}
                  onKeyDown={this.enterSearch}
                />
                <button
                  data-testid="searchButton"
                  type="button"
                  onClick={this.onSubmitSearch}
                  className="searchBtn"
                >
                  <AiOutlineSearch />
                </button>
              </div>
              {this.renderBasedOnStatus()}
            </div>
          </div>
        </div>
        <div className="small-screen-view">
          <div className="all-jobs-container-small">
            <div>
              <input
                type="search"
                className="input-search-style"
                onChange={this.onChangeInput}
                onKeyDown={this.enterSearch}
              />
              <button
                data-testid="searchButton"
                type="button"
                onClick={this.onSubmitSearch}
                className="searchBtn"
              >
                <AiOutlineSearch />
              </button>
            </div>

            {this.profileContainer()}
            <hr className="hr-styling" />
            <h1 className="heading">Type of Employment</h1>
            {this.checkBoxContainer()}
            <hr className="hr-styling" />
            <h1 className="heading">Salary Range</h1>
            {this.radioBtnContainer()}
          </div>
          <div className="">{this.renderBasedOnStatus()}</div>
        </div>
      </>
    )
  }
}
export default AllJobs
