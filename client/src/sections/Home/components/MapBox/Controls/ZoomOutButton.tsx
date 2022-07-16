import React, { useState, useEffect } from "react";
import { Popover } from "antd";
import styled, { css } from "styled-components";
import ZoomOutIcon from "sections/Home/components/MapBox/icons/minus.svg";

interface Props {
  map: mapboxgl.Map;
}

const ZoomOutButton: React.FC<Props> = ({ map }) => {
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const handler = () => {
      const zoom = map.getZoom();
      setDisabled(zoom <= 2);
    }
    handler();
    map.on("zoom", handler);
    return () => {
      map.off("zoom", handler);
    }
  }, [map]);

  return (
    <Popover content={<span>Zoom out</span>} placement="left" overlayClassName="map-popover">
      <ZoomOut onClick={() => map.zoomOut()} disabled={disabled}>
        <ImageWrapper>
          <img src={ZoomOutIcon} alt="" draggable={false} />
        </ImageWrapper>
      </ZoomOut>
    </Popover>
  );
}

const ZoomOut = styled.button`
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

export default ZoomOutButton;
