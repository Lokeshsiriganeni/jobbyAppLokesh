import './index.css'
import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'

const JobCard = props => {
  const {eachJobDetails} = props
  const {
    companyLogoUrl,

    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,

    title,
  } = eachJobDetails

  return (
    <Link to={`/jobs/${id}`} className="link-item">
      <li className="company-container">
        <div className="title-img-rating">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div className="title-rating">
            <h1>{title}</h1>
            <div className="rating-container">
              <div>
                <AiFillStar />
              </div>
              <div>
                <p className="rating">{rating}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="location-type-package">
          <div className="location-type">
            <p className="location-style">{location}</p>
            <p>{employmentType}</p>
          </div>
          <p>{packagePerAnnum}</p>
        </div>
        <hr />
        <h1>Description</h1>
        <p>{jobDescription}</p>
      </li>
    </Link>
  )
}
export default JobCard
