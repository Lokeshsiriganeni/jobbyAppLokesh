import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BiLinkExternal} from 'react-icons/bi'
import Header from '../Header'
import SimilarJobs from '../SimilarJobs'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AboutJobItem extends Component {
  state = {
    jobData: {},
    similarJobsData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProductData()
  }

  redirectToExternal = event => {
    console.log('nmern')
  }

  getProductData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedJobsData = [data.job_details].map(eachDetails => ({
        companyLogoUrl: eachDetails.company_logo_url,
        companyWebsiteUrl: eachDetails.company_website_url,
        employmentType: eachDetails.employment_type,
        id: eachDetails.id,
        jobDescription: eachDetails.job_description,
        lifeAtCompany: {
          description: eachDetails.life_at_company.description,
          imageUrl: eachDetails.life_at_company.image_url,
        },
        location: eachDetails.location,
        packagePerAnnum: eachDetails.package_per_annum,
        rating: eachDetails.rating,
        skills: eachDetails.skills.map(eachSill => ({
          imageUrl: eachSill.image_url,
          name: eachSill.name,
        })),
        title: eachDetails.title,
      }))

      const updatedSimilarJobs = data.similar_jobs.map(eachSimilar => ({
        companyLogoUrl: eachSimilar.company_logo_url,
        employmentType: eachSimilar.employment_type,
        id: eachSimilar.id,
        jobDescription: eachSimilar.job_description,
        location: eachSimilar.location,
        rating: eachSimilar.rating,
        title: eachSimilar.title,
      }))

      this.setState({
        jobData: updatedJobsData,
        similarJobsData: updatedSimilarJobs,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiJobStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div className="products-details-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  retryBtnClicked = () => {
    this.getProductData()
  }

  renderFailureView = () => (
    <div className="product-details-error-view-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="error-view-image"
      />
      <h1 className="product-not-found-heading">Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" className="button" onClick={this.retryBtnClicked}>
        Retry
      </button>
    </div>
  )

  renderJobDetailsView = () => {
    const {jobData} = this.state

    const {
      employmentType,
      companyLogoUrl,
      companyWebsiteUrl,
      id,
      jobDescription,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
      skills,
      title,
    } = jobData[0]

    return (
      <div className="job-details-card">
        <div className="title-img-rating">
          <img src={companyLogoUrl} alt="job details company logo" />
          <div className="title-rating">
            <p>{title}</p>
            <p>
              <AiFillStar className="rating-style" />
              {rating}
            </p>
          </div>
        </div>
        <div className="location-type-package">
          <div className="location-type">
            <p className="location-style">
              <MdLocationOn className="location-img" />
              {location}
            </p>
            <p className="job-type-style">{employmentType}</p>
          </div>
          <p className="package-style">{packagePerAnnum}</p>
        </div>
        <div>
          <h1>Description</h1>
          <div className="description-container">
            <div>
              <a href={companyWebsiteUrl} className="visit-website">
                Visit
              </a>
            </div>
            <a href={companyWebsiteUrl} className="visit-website link-style">
              <BiLinkExternal />
            </a>
          </div>
          <p>{jobDescription}</p>
        </div>
        <h1>Skills</h1>
        <div className="skills-container">
          <ul className="each-skill-container">
            {skills.map(eachSkill => (
              <li className="skill-img-container" key={eachSkill.name}>
                <img
                  src={eachSkill.imageUrl}
                  alt="job details company logo"
                  className="job-details-company-logo"
                />
                <p className="skill-name">{eachSkill.name}</p>
                <p>{eachSkill.id}</p>
              </li>
            ))}
          </ul>
        </div>

        <h1>Life at Company</h1>
        <div className="life-at-company-container">
          <p>{lifeAtCompany.description}</p>
          <img
            src={lifeAtCompany.imageUrl}
            className="life-at-company-img"
            alt="life at company"
          />
        </div>
      </div>
    )
  }

  renderJobDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {similarJobsData} = this.state

    return (
      <>
        <Header />
        <div className="product-item-details-container">
          <div className="job-details-card">{this.renderJobDetails()}</div>
          <h1>Similar Jobs</h1>
          <ul className="each-details-card">
            {similarJobsData.map(eachItem => (
              <SimilarJobs eachItem={eachItem} key={eachItem.id} />
            ))}
          </ul>
        </div>
      </>
    )
  }
}

export default AboutJobItem
