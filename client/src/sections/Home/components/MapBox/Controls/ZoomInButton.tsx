import React, { useState, useEffect } from "react";
import { Popover } from "antd";
import styled, { css } from "styled-components";
import ZoomInIcon from "sections/Home/components/MapBox/icons/plus.svg";

interface Props {
  map: mapboxgl.Map;
}

const ZoomInButton: React.FC<Props> = ({ map }) => {
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const handler = () => {
      const zoom = map.getZoom();
      setDisabled(zoom >= 22);
    }
    handler();
    map.on("zoomend", handler);
    return () => {
      map.off("zoomend", handler);
    }
  }, [map]);

  return (
    <Popover content={<span>Zoom in</span>} placement="left" overlayClassName="map-popover">
      <ZoomIn onClick={() => map.zoomIn()} disabled={disabled}>
        <ImageWrapper>
          <img src={ZoomInIcon} alt="" draggable={false} />
        </ImageWrapper>
      </ZoomIn>
    </Popover>
  );
}

const ZoomIn = styled.button`
  border: none;
  display: flex;
  background-color: #FFFFFF;
  padding: 8px;
  cursor: pointer;

  ${(props: { disabled: boolean }) => props.disabled && css`
    opacity: 0.2;
    cursor: not-allowed;
  `}

  &:hover {
    background-color: #F2F2F2;
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

export default ZoomInButton;
