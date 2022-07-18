import React, { useContext } from "react";
import styled from "styled-components";
import AddressFilter from "sections/Home/components/MapBox/Sidebar/Filters/AddressFilter";
import { MapContext } from "sections/Home/components/MapBox/Context";

interface Props {
  map: mapboxgl.Map | null;
}

const MapSearch: React.FC<Props> = ({ map }) => {
  const { country, city } = useContext(MapContext);
  return (
    <Search>
      <AddressFilter 
        map={map}
        country={country || ''}
        city={city || ''}
        disabled={false}
      />
    </Search>
  );
}

const Search = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 98;
  width: 320px;
  max-width: calc(100% - 30px);
  display: none;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 750px) {
    display: flex;
  }

`;

export default MapSearch;
