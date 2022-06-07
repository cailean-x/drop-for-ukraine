import React from "react";
import { Link } from "react-router-dom";
import { Card, Col, Input, Row, Typography } from "antd";

import parisImage from "../../assets/paris.jpg";
import berlinImage from "../../assets/berlin.jpg";
import turinImage from "../../assets/turin.jpg";
import londonImage from "../../assets/london.jpg";

const { Title } = Typography;
const { Search } = Input;

interface Props {
  onSearch: (value: string) => void;
}

export const HomeHero = ({ onSearch }: Props) => {
  return (
    <div className="home-hero">
      <div className="home-hero__search">
        <Title className="home-hero__title">
          The Easy Way to Drop Off Humanitarian Aid for Ukraine
        </Title>
        <Search
          placeholder="Search 'United Kingdom'"
          size="large"
          enterButton
          className="home-hero__search-input"
          onSearch={onSearch}
        />
      </div>
      <Row gutter={12} className="home-hero__cards">
        <Col xs={12} md={6}>
          <Link to="/listings/paris">
            <Card cover={<img alt="Toronto" src={parisImage} />}>Paris</Card>
          </Link>
        </Col>
        <Col xs={12} md={6}>
          <Link to="/listings/berlin">
            <Card cover={<img alt="Berlin" src={berlinImage} />}>Berlin</Card>
          </Link>
        </Col>
        <Col xs={0} md={6}>
          <Link to="/listings/turin">
            <Card cover={<img alt="Turin" src={turinImage} />}>Turin</Card>
          </Link>
        </Col>
        <Col xs={0} md={6}>
          <Link to="/listings/london">
            <Card cover={<img alt="London" src={londonImage} />}>London</Card>
          </Link>
        </Col>
      </Row>
    </div>
  );
};
