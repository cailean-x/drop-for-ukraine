import React from "react";
import styled from "styled-components";
import CapacityIcon from "sections/Home/components/MapBox/icons/area.svg";
import MarkerIcon from "sections/Home/components/MapBox/icons/marker.svg";

interface Props {
  properties: Map.DropsLayerProperties;
}

const MapboxPopup: React.FC<Props> = ({ properties }) => {
  return (
    <PopupWrapper>
      <Popup>
        <PopupImg><img src={properties.image} alt="" /></PopupImg>
        <PopupBody>
          <PopupTitle>{properties.title}</PopupTitle>
          <PopupBodyItem>
            <PopupIcon><img src={CapacityIcon} alt="" /></PopupIcon>
            <div>{properties.capacity} <span>m<sup>2</sup></span></div>
          </PopupBodyItem>
          <PopupBodyItem>
            <PopupIcon><img src={MarkerIcon} alt="" /></PopupIcon>
            <div>
              {properties.address.split(",")[0]}
            </div>
          </PopupBodyItem>
        </PopupBody>
      </Popup>
    </PopupWrapper>
  );
}

const PopupWrapper = styled.div`
  width: 280px;
  background: linear-gradient(166deg,rgb(255 255 255) 40%,rgb(122 181 232) 100%);
  box-shadow: 0px 1px 24px rgba(0, 0, 0, 0.1);
  padding: 2px;
  backdrop-filter: blur(6px);
  border-radius: 10px;
  overflow: hidden;
  user-select: none;
  cursor: default;
`;

const Popup = styled.div`
  display: flex;
  background-color: #f4f4f4;
  border-radius: 10px;
  overflow: hidden;
`;

const PopupBody = styled.div`
  padding: 5px 10px;
`;

const PopupBodyItem = styled.div`
  display: flex;
  margin-bottom: 5px;
  line-height: 20px;
  font-family: 'Rubik';
  font-weight: 400; 
  font-size: 12px;
  color: #757575;
`;

const PopupImg = styled.div`
  height: auto;
  width: 25%;
  background: #e2e2e2;
  flex-shrink: 0;

  & img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;

const PopupTitle = styled(PopupBodyItem)`
  font-family: 'Rubik';
  font-weight: 500;
  font-size: 12px;
  color: #02020B;
`;

const PopupIcon = styled.div`
  height: 19px;
  width: 19px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

export default MapboxPopup;
