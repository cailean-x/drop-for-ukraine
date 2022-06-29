import React, { useEffect, useRef, useState} from "react";
import { Card, Button, Popover } from "antd";

interface Props {
  children?: React.ReactNode;
}

const MapSideber: React.FC<Props> = ({ children }) => {
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
        <Card 
          title="Filters"
          className="map-filters-inner"
          bordered={false}
          extra={
            <Button type="default" icon="close" onClick={() => setVisible(false)}></Button>
          }
        >
          {children}
        </Card>
      </div>
    </>
  );
}


export default MapSideber;
