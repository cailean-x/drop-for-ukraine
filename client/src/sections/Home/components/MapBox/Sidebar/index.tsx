import React, { useEffect, useRef, useState } from "react";
import { Button, Popover, Tabs } from "antd";
import styled from "styled-components";

interface Props {
  filters?: React.ReactNode;
  results?: React.ReactNode;
}

const MapSideber: React.FC<Props> = ({ filters, results }) => {
  const [sidebarWidth, setSidebarWidth] = useState("0");
  const [visible, setVisible] = useState(false);
  const sidebarNode = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sidebarNode.current) return;
    const handler = () => setSidebarWidth(getComputedStyle(sidebarNode.current!).width!);
    handler();
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("resize", handler);
    }
  }, []);

  return (
    <>
      <FilterOpenButton>
        <Popover content={<span>Show filters</span>} placement="right">
          <Button type="default" icon="filter" onClick={() => setVisible(true)}></Button>
        </Popover>
      </FilterOpenButton>
      <Filters
        ref={sidebarNode}
        style={{ left: visible ? "0" : "-" + sidebarWidth }}
      >
        <FiltersInner>
          <FilterTabs
            tabBarGutter={5}
            tabBarExtraContent={<Button type="default" icon="close"onClick={() => setVisible(false)}></Button>}
          >
            <Tabs.TabPane tab="Filters" key="1">
              {filters}
            </Tabs.TabPane>
            <Tabs.TabPane tab="Results" key="2">
              {results}
            </Tabs.TabPane>
          </FilterTabs>
        </FiltersInner>
      </Filters>
    </>
  );
}

export default MapSideber;

const FilterOpenButton = styled.div`
  position: absolute;
  left: 15px;
  top: 15px;
  background: #fff;
  padding: 5px 8px;
  z-index: 5;
  box-shadow: 0px 0px 3px 0px #c1c1c1;
  border-radius: 5px;
`;

const Filters = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 330px;
  height: 100%;
  z-index: 10;
  transition: left 0.2s linear;
  background-color: #fff;

  @media screen and (max-width: 700px) {
    width: 100%;
  }

`;

const FiltersInner = styled.div`
  width: 100%;
  height: 100%;;
`;

const FilterTabs = styled<any>(Tabs)`
  display: flex;
  flex-direction: column;
  height: 100%;


  & .ant-tabs-content {
    flex-grow: 1;
    height: 1px;
  }

  & .ant-tabs-bar {
    padding: 0 15px;
    margin: 0;
  }

`;


