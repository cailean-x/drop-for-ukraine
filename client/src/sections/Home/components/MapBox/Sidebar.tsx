import React, { useEffect, useRef, useState } from "react";
import { Button, Popover, Tabs } from "antd";

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
      <div className="map-filters-open">
      <Popover content={<span>Show filters</span>} placement="right">
        <Button type="default" icon="filter" onClick={() => setVisible(true)}></Button>
      </Popover>
      </div>
      <div
        ref={sidebarNode}
        className="map-filters"
        style={{ left: visible ? "0" : "-" + sidebarWidth }}
      >
        <div className="map-filters-inner">
          <Tabs
            className="sidebar-tabs"
            tabBarGutter={5}
            tabBarExtraContent={<Button type="default" icon="close"onClick={() => setVisible(false)}></Button>}
          >
            <Tabs.TabPane tab="Filters" key="1">
              {filters}
            </Tabs.TabPane>
            <Tabs.TabPane tab="Results" key="2">
              {results}
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </>
  );
}


export default MapSideber;
