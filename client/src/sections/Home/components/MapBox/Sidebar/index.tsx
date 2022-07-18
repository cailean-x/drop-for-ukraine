import React, { useEffect, useRef, useState, useContext, useCallback } from "react";
import { Popover, Tabs } from "antd";
import styled, { css } from "styled-components";
import CloseIcon from "sections/Home/components/MapBox/icons/arrow-left.svg";
import FilterIcon from "sections/Home/components/MapBox/icons/filter.svg";
import { MapContext } from "sections/Home/components/MapBox/Context";

interface Props {
  filters?: React.ReactNode;
  results?: React.ReactNode;
  showBorder: boolean;
}

const MapSideber: React.FC<Props> = ({ filters, results, showBorder }) => {
  const { setOnToggleClick, setSidebarOpened } = useContext(MapContext);
  const [sidebarWidth, setSidebarWidth] = useState("0");
  const [sidebarHeight, setSidebarHeight] = useState("0");
  const [activeTab, setActiveTab] = useState("1");
  const [animate, setAnimate] = useState(false);
  const [visible, setVisible] = useState(false);
  const [sidebarState, setSidebarState] = useState<"opened" | "closed">("closed");
  const sidebarNode = useRef<HTMLDivElement>(null);

  const onToggleClick = useCallback(() => {
    setAnimate(true);
    setVisible(sidebarState === "opened" ? false : true);
  }, [sidebarState]);

  const onCloselick = useCallback(() => {
    setAnimate(true);
    setVisible(false);
  }, []);

  useEffect(() => {
    if (setSidebarOpened) setSidebarOpened(sidebarState === "opened");
  }, [setSidebarOpened, sidebarState]);

  useEffect(() => {
    if (setOnToggleClick) setOnToggleClick(onToggleClick);
  }, [setOnToggleClick, onToggleClick]);

  useEffect(() => {
    if (!sidebarNode.current) return;
    const handler = () => {
      setSidebarWidth(getComputedStyle(sidebarNode.current!).width!);
      setSidebarHeight(getComputedStyle(sidebarNode.current!).height!);
    }
    handler();
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("resize", handler);
    }
  }, []);

  const onSidebarTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    e.persist();
    if (e.propertyName === 'left' || e.propertyName === 'top') {
      setAnimate(false);
    }
    if (e.propertyName === 'left') {
      const left = parseInt(getComputedStyle(e.currentTarget)[e.propertyName as any]);
      setSidebarState(left === 0 ? "opened" : "closed");
    }
    if (e.propertyName === 'top') {
      const top = parseInt(getComputedStyle(e.currentTarget)[e.propertyName as any]);
      setSidebarState(top === 90 ? "opened" : "closed");
    }
  };

  return (
    <>
      <Sidebar
        ref={sidebarNode}
        style={{ 
          left: visible ? "0" : "-" + sidebarWidth,
          top: visible ? "90px" : parseInt(sidebarHeight) + 90 + 'px',
        }}
        onTransitionEnd={onSidebarTransitionEnd}
        animate={animate}
      >
        <SidebarInner>
          <SidebarClosePanel onClick={onCloselick}></SidebarClosePanel>
          <SidebarTabs
            tabBarGutter={5}
            activeTab={activeTab}
            showBorder={showBorder}
            onTabClick={(tab: string) => setActiveTab(tab)}
            tabPosition={"top"}
          >
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
          <SidebarCloseButton onClick={onToggleClick}>
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

  @media screen and (max-width: 750px) {
    display: none;
  }
`;

const SidebarClosePanel = styled.div`
  padding: 20px;
  display: none;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 750px) {
    display: flex;
  }

  &::after {
    content: '';
    display: block;
    width: 40px;
    height: 4px;
    background: #E6E6E6;
    border-radius: 100px;
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

const Sidebar = styled.div<any>`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  background-color: #fff;
  ${(props: { animate: boolean}) => props.animate ? css`transition: left 0.2s linear, top 0.2s linear;` :``}

  &:before, &:after {
    content: "";
    position: absolute;
    left: 100%;
    height: 40px;
    width: 40px;
    overflow: hidden;

    @media screen and (max-width: 750px) {
      content: none;
    }
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
    left: 0 !important;
    width: 100%;
    height: calc(100% - 90px);
    border-top-left-radius: 40px;
    border-top-right-radius: 40px;
  }

  @media screen and (min-width: 750px) {
    top: 0 !important;
    width: 340px;
    height: 100%;
  }
`;

const SidebarInner = styled.div`
  width: 100%;
  height: 100%;;
  display: flex;
  flex-direction: column;
`;

const SidebarTabs = styled<any>(Tabs)`
  display: flex;
  flex-direction: column;
  height: 1px;
  flex-grow: 1;

  @media screen and (max-width: 750px) {
    flex-direction: column-reverse;
  }

  & .ant-tabs-content {
    flex-grow: 1;
    height: 1px;
  }

  & .ant-tabs-tabpane {
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  & .ant-tabs-bar {
    padding: ${(props: { showBorder: boolean }) => props.showBorder ? '0 15px 0 0' : '0 15px'};
    margin: 0 0 20px -5px;
    border: none;

    @media screen and (max-width: 750px) {
      flex-direction: column-reverse;
      padding: 20px 15px 0 15px !important;
      margin: 0 0 15px 0 !important;
    }
  }

  & .ant-tabs-nav-scroll {
    display: flex;
    justify-content: center;
    margin: 0 5px;
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

    &:nth-child(1) {
      transform: translateX(3px);
    }

    &:nth-child(2) {
      transform: translateX(-5px);
    }
  }

  & .ant-tabs-ink-bar {
    z-index: -1;
    margin: 4px 0 4px 5px;
    height: 80%;
    width: calc(50% - 5px) !important;
    background-color: #fff;
    box-shadow: 0px 13px 10px rgba(50, 50, 71, 0.05), 0px 22px 28px rgba(50, 50, 71, 0.05);
    border-radius: 50px;
    ${
      (props: { activeTab: string }) => (
        props.activeTab === "1" ?
        css`transform: translate3d(0, 0px, 0px) !important` :
        css`transform: translate3d(100%, 0px, 0px) !important`
      )
    }
  }

  & .ant-tabs-tab {
    width: 50%;
    font-family: 'Rubik';
    font-weight: 500;
    text-align: center;
  }

`;
