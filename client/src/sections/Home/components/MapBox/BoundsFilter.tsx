import React from "react";
import { Switch } from 'antd';

interface Props {
  filterBoundsState: Common.ReactState<boolean>;
}

const MapBoundsFilter: React.FC<Props> = ({ filterBoundsState }) => {
  return (
    <div className="map-bounds-filter">
      <div className="map-bounds-filter-text">Search as I move the map</div>
      <Switch size="small" checked={filterBoundsState[0]} onChange={state => filterBoundsState[1](state)} />
    </div>
  );
}

export default MapBoundsFilter;
