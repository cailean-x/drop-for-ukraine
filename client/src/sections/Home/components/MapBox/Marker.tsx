import React from "react";
import styled from "styled-components";
import MarkerIcon from "sections/Home/components/MapBox/icons/marker_blue.svg";

const Marker: React.FC = () => {
  return (
    <StyledMarker><img src={MarkerIcon} alt="" /></StyledMarker>
  );
}

const StyledMarker = styled.div`
  width: 30px;
  height: 30px;
`;

export default Marker;
