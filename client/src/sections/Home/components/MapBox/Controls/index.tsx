import React from "react";
import styled from "styled-components";
import BearingButtom from "sections/Home/components/MapBox/Controls/BearingButton";
import ZoomInButton from "sections/Home/components/MapBox/Controls/ZoomInButton";
import ZoomOutButton from "sections/Home/components/MapBox/Controls/ZoomOutButton";

interface Props {
  map: mapboxgl.Map;
}

const MapControls: React.FC<Props> = ({ map }) => {
  return (
    <Controls>
      <BearingButtom map={map} />
      <ZoomWrapper>
        <ZoomInButton map={map} />
        <ZoomOutButton map={map} />
      </ZoomWrapper>
    </Controls>
  );
}

const Controls = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 5;
  user-select: none;
`;

const ZoomWrapper = styled.div`
  background: #FFFFFF;
  border: 1px solid #F2F2F2;
  box-shadow: 0px 4px 4px rgba(50, 50, 71, 0.08), 0px 4px 8px rgba(50, 50, 71, 0.06);
  border-radius: 100px;
  overflow: hidden;
  margin-top: 5px;

  & > *:not(:last-child) {
    position: relative;

    &::after {
      content: '';
      display: block;
      position: absolute;
      background-color: #EDEDED;
      bottom: 0;
      left: 50%;
      height: 1px;
      width: 60%;
      transform: translateX(-50%);
    }
  }

  @media screen and (max-width: 750px) {
    display: none;
  }

`;

export default MapControls;
