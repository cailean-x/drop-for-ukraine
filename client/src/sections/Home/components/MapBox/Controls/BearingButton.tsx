import React, { useState, useEffect } from "react";
import { Popover } from "antd";
import styled from "styled-components";
import CompassIcon from "sections/Home/components/MapBox/icons/compass.svg";

interface Props {
  map: mapboxgl.Map;
}

const BearingButton: React.FC<Props> = ({ map }) => {
  const [bearing, setBearing] = useState(0);

  useEffect(() => {
    const handler = () => {
      const bearing = map.getBearing();
      setBearing(bearing);
    }
    handler();
    map.on("rotate", handler);
    return () => {
      map.off("rotate", handler);
    }
  }, [map]);

  return (
    <Popover content={<span>Reset bearing to north</span>} placement="left" overlayClassName="map-popover">
      <Bearing onClick={() => map.rotateTo(0)}>
        <CompassWrapper style={{ transform: `rotate(${bearing}deg)` }}>
          <ImageWrapper>
            <img src={CompassIcon} alt="" draggable={false} />
          </ImageWrapper>
        </CompassWrapper>
      </Bearing>
    </Popover>
  );
}

const Bearing = styled.button`
  border: none;
  background-color: #FFFFFF;
  border: 1px solid #F2F2F2;
  box-shadow: 0px 4px 4px rgba(50, 50, 71, 0.08), 0px 4px 8px rgba(50, 50, 71, 0.06);
  border-radius: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  cursor: pointer;

  &:hover {
    background-color: #F2F2F2;
  }
`;

const CompassWrapper = styled.div`
  display: inline-flex;

  img {
    padding: 2px 2px 0px 0px;
    transform: rotate(313deg);
  }
`;

const ImageWrapper = styled.div`
  height: 15px;
  width: 15px;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    max-width: 100%;
    max-height: 100%;
  }
`;

export default BearingButton;
