import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons';


function Rating(props) {

    return (
        <div>
            {
                props.value >= 1 &&
                <FontAwesomeIcon icon={faStar} className="rating-star"/> 
            }
            {
                props.value >= 2 
                && <FontAwesomeIcon icon={faStar} className="rating-star"/>
            }
            {
                props.value >= 3 
                && <FontAwesomeIcon icon={faStar} className="rating-star"/>
            }
            {
                props.value >= 4 
                && <FontAwesomeIcon icon={faStar} className="rating-star"/>
            }
            {
                props.value >= 5 
                && <FontAwesomeIcon icon={faStar} className="rating-star"/>
            }                        
        </div>
    )
}

export default Rating;