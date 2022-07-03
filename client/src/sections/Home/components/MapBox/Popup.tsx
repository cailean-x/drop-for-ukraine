import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faTableCellsLarge } from '@fortawesome/free-solid-svg-icons';

interface Props {
  properties: Map.DropsLayerProperties;
}

const MapboxPopup: React.FC<Props> = ({ properties }) => {
  return (
    <div
      className="result-item"
    >
      <div className="result-img"><img src={properties.image} alt="" /></div>
      <div className="result-body">
        <div className="result-body-item title">{properties.title}</div>
        <div className="result-body-item">
          <div className="icon"><FontAwesomeIcon icon={faTableCellsLarge} /></div>
          <div>{properties.capacity} <span>m<sup>2</sup></span></div>
        </div>
        <div className="result-body-item">
          <div className="icon"><FontAwesomeIcon icon={faLocationDot} /></div>
          <div>
            {properties.address.split(",")[0]}
          </div>
        </div>
      </div>
  </div>
  )
}

export default MapboxPopup;
