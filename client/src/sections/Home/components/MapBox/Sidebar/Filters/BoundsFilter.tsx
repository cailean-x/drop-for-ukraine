import React from "react";
import { Switch } from 'antd';
import styled from "styled-components";

interface Props {
  filterBoundsState: Common.ReactState<boolean>;
}

const MapBoundsFilter: React.FC<Props> = ({ filterBoundsState }) => {
  return (
    <BoundsFilter>
      <BoundsFilterText>Search as I move the map</BoundsFilterText>
      <Switch size="small" checked={filterBoundsState[0]} onChange={state => filterBoundsState[1](state)} />
    </BoundsFilter>
  );
}

const BoundsFilter = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 5;
  background-color: #fff;
  cursor: default;
  user-select: none;
  border: 1px solid #F2F2F2;
  box-shadow: 0px 4px 4px rgba(50, 50, 71, 0.08), 0px 4px 8px rgba(50, 50, 71, 0.06);
  border-radius: 100px;
  padding: 4px 10px;
`;

const BoundsFilterText = styled.div`
  font-size: 14px;
  color: #757575;
  margin-right: 10px;
`;

export default MapBoundsFilter;
