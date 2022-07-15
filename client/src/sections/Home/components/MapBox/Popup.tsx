import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faTableCellsLarge } from '@fortawesome/free-solid-svg-icons';
import styled from "styled-components";

interface Props {
  properties: Map.DropsLayerProperties;
}

const MapboxPopup: React.FC<Props> = ({ properties }) => {
  return (
    <Popup>
      <PopupImg><img src={properties.image} alt="" /></PopupImg>
      <PopupBody>
        <PopupTitle>{properties.title}</PopupTitle>
        <PopupBodyItem>
          <PopupIcon><FontAwesomeIcon icon={faTableCellsLarge} /></PopupIcon>
          <div>{properties.capacity} <span>m<sup>2</sup></span></div>
        </PopupBodyItem>
        <PopupBodyItem>
          <PopupIcon><FontAwesomeIcon icon={faLocationDot} /></PopupIcon>
          <div>
            {properties.address.split(",")[0]}
          </div>
        </PopupBodyItem>
      </PopupBody>
    </Popup>
  );
}

const Popup = styled.div`
  width: 300px;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
  display: flex;
  overflow: hidden;
  cursor: default;
  user-select: none;
`;

const PopupBody = styled.div`
  padding: 5px 10px;
`;

const PopupBodyItem = styled.div`
  display: flex;
  margin-bottom: 5px;
  line-height: 20px;
`;

const PopupImg = styled.div`
  height: auto;
  width: 20%;
  background: rgb(196 196 196);
  flex-shrink: 0;

  & img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;

const PopupTitle = styled(PopupBodyItem)`
  color: #02020B;
`;

const PopupIcon = styled.div`
  height: 19px;
  display: flex;
  align-items: center;
  width: 25px;
  flex-shrink: 0;
`;

export default MapboxPopup;
