import './index.css'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'

const SimilarJobs = props => {
  const {eachItem} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    rating,
    title,
  } = eachItem
  return (
    <li className="each-similar-job-description">
      <div className="title-img-rating">
        <img src={companyLogoUrl} alt="company logo" className="company-logo" />
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
      <h1 className="heading">Description</h1>
      <p>{jobDescription}</p>
      <div className="location-type-package">
        <div className="location-type">
          <p className="location-style">
            <MdLocationOn />
            {location}
          </p>
          <p>{employmentType}</p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobs
