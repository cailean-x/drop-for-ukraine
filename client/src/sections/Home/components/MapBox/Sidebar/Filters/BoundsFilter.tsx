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
  top: 20px;
  right: 20px;
  z-index: 5;
  background-color: #fff;
  cursor: default;
  user-select: none;
  border: 1px solid #F2F2F2;
  box-shadow: 0px 13px 10px rgba(50, 50, 71, 0.05), 0px 22px 28px rgba(50, 50, 71, 0.05);
  border-radius: 100px;
  padding: 4px 11px 4px 10px;

  @media screen and (max-width: 750px) {
    top: unset;
    bottom: 20px;
    right: 50%;
    transform: translateX(50%);
  }

  & .ant-switch-checked {
    background: #D2E6F7 !important;
    box-shadow: inset 0px 1px 4px #9CBFE6 !important;
  }

  & .ant-switch-checked::after {
    left: calc(100% + 7px) !important;
    background: #4095DA !important;
    box-shadow: 0px 0px 3px 1px #9CBFE6 !important;
  }

  & .ant-switch {
    width: 20px;
    max-width: 20px;
    min-width: 20px;
    height: 8px;
    background-color: rgba(0, 0, 0, 0.1);
    box-shadow: inset 0px 1px 4px rgba(0, 0, 0, 0.1);
    border-radius: 100px;

    &:after {
      width: 16px;
      height: 16px;
      background: #fff;
      top: -5px;
      left: -6px;
      box-shadow: 0px 0px 3px 1px rgb(0 0 0 / 17%);
    }
  }

`;

const BoundsFilterText = styled.div`
  font-family: 'Rubik', sans-serif;
  letter-spacing: 0.01em;
  font-size: 14px;
  color: #757575;
  margin-right: 11px;
`;

export default MapBoundsFilter;
