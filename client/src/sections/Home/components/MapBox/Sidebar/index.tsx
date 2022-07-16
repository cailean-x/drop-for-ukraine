import React, { useEffect, useRef, useState } from "react";
import { Popover, Tabs } from "antd";
import styled from "styled-components";
import CloseIcon from "sections/Home/components/MapBox/icons/arrow-left.svg";
import FilterIcon from "sections/Home/components/MapBox/icons/filter.svg";

interface Props {
  filters?: React.ReactNode;
  results?: React.ReactNode;
}

const MapSideber: React.FC<Props> = ({ filters, results }) => {
  const [sidebarWidth, setSidebarWidth] = useState("0");
  const [visible, setVisible] = useState(false);
  const [sidebarState, setSidebarState] = useState<"opened" | "closed">("closed");
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

  const onSidebarTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    e.persist();
    if (e.propertyName === 'left') {
      const left = parseInt(getComputedStyle(e.currentTarget)[e.propertyName as any]);
      setSidebarState(left === 0 ? "opened" : "closed");
    }
  };

  return (
    <>
      <Sidebar
        ref={sidebarNode}
        style={{ left: visible ? "0" : "-" + sidebarWidth }}
        onTransitionEnd={onSidebarTransitionEnd}
      >
        <SidebarInner>
          <SidebarTabs tabBarGutter={5}>
            <Tabs.TabPane tab="Filters" key="1">
              {filters}
            </Tabs.TabPane>
            <Tabs.TabPane tab="Results" key="2">
              {results}
            </Tabs.TabPane>
          </SidebarTabs>
        </SidebarInner>
        <Popover
          placement="right"
          overlayClassName="map-popover"
          content={<span>{sidebarState === "opened" ? "Hide filters" : "Show filters" }</span>}
        >
          <SidebarCloseButton onClick={() => setVisible(sidebarState === "opened" ? false : true)}>
            <ImageWrapper><img src={sidebarState === "opened" ? CloseIcon : FilterIcon} alt="" /></ImageWrapper>
          </SidebarCloseButton>
        </Popover>
      </Sidebar>
    </>
  );
}

export default MapSideber;

const SidebarButton = styled.button`
  display: flex;
  align-items: center;
  position: absolute;
  z-index: 5;
  background-color: #fff;
  border: 1px solid #F2F2F2;
  box-shadow: 0px 4px 4px rgb(50 50 71 / 8%), 0px 4px 8px rgb(50 50 71 / 6%);
  border-radius: 50%;
  padding: 10px;
  cursor: pointer;

  &:hover {
    background-color: #F2F2F2;
  }

`;

const SidebarCloseButton = styled(SidebarButton)`
  top: 20px;
  left: calc(100% + 25px);
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

const Sidebar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 340px;
  height: 100%;
  z-index: 10;
  transition: left 0.2s linear;
  background-color: #fff;

  &:before, &:after {
    content: "";
    position: absolute;
    left: 100%;
    height: 40px;
    width: 40px;
    overflow: hidden;
  }

  &:before {
    top: 0;
    border-top-left-radius: 50%;
    box-shadow: 0px -20px 0px 0px #fff;
  }

  &:after {
    bottom: 0;
    border-bottom-left-radius: 50%;
    box-shadow: 0px 20px 0px 0px #fff;
  }

  @media screen and (max-width: 750px) {
    width: 100%;
  }
`;

const SidebarInner = styled.div`
  width: 100%;
  height: 100%;;
`;

const SidebarTabs = styled<any>(Tabs)`
  display: flex;
  flex-direction: column;
  height: 100%;

  & .ant-tabs-content {
    flex-grow: 1;
    height: 1px;
  }

  & .ant-tabs-bar {
    padding: 0 15px;
    margin: 0 0 15px 0;
    border: none;
  }

  & .ant-tabs-nav-scroll {
    display: flex;
    justify-content: center;
    margin: 0 25px;
    background: #EDF5FC;
    border-radius: 50px;
  }

  & .ant-tabs-nav {
    z-index: 1;
    width: 100%;
  }

  & .ant-tabs-nav .ant-tabs-tab-active,
  & .ant-tabs-nav .ant-tabs-tab:active {
    color: #4095DA;
  }

  & .ant-tabs-tab {
    color: #02020B;
  }

  & .ant-tabs-ink-bar {
    z-index: -1;
    margin: 4px 0 4px 5px;
    height: 80%;
    width: 44% !important;
    background-color: #fff;
    box-shadow: 0px 13px 10px rgba(50, 50, 71, 0.05), 0px 22px 28px rgba(50, 50, 71, 0.05);
    border-radius: 50px;
  }

  & .ant-tabs-tab {
    width: 50%;
    font-family: 'Rubik';
    font-weight: 500;
    text-align: center;
  }

`;
