import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { Col, Row, Layout, Typography } from "antd";
import { LISTINGS } from "../../lib/graphql/queries";
import {
  Listings as ListingsData,
  ListingsVariables,
} from "../../lib/graphql/queries/Listings/__generated__/Listings";
import { ListingsFilter } from "../../lib/graphql/globalTypes";
import { useScrollToTop } from "../../lib/hooks";
import { displayErrorMessage } from "../../lib/utils";
import { HomeHero, HomeListings, HomeListingsSkeleton } from "./components";

import mapBackground from "./assets/map-background.jpg";
import romeImage from "./assets/rome.jpg";
import smallTownImage from "./assets/small-town.jpg";
import mapboxgl from "mapbox-gl";
import MapboxMap from "./components/MapBox";

const { Content } = Layout;
const { Paragraph, Title } = Typography;

const PAGE_LIMIT = 4;
const PAGE_NUMBER = 1;

export const Home = () => {
  const { loading, data } = useQuery<ListingsData, ListingsVariables>(
    LISTINGS,
    {
      variables: {
        filter: ListingsFilter.PRICE_HIGH_TO_LOW,
        limit: PAGE_LIMIT,
        page: PAGE_NUMBER,
      },
      fetchPolicy: "cache-and-network",
    }
  );

  const history = useHistory();
  useScrollToTop();

  const onSearch = (value: string) => {
    const trimmedValue = value.trim();

    if (trimmedValue) {
      history.push(`/listings/${trimmedValue}`);
    } else {
      displayErrorMessage("Please enter a valid search!");
    }
  };

  const renderListingsSection = () => {
    if (loading) {
      return <HomeListingsSkeleton />;
    }

    if (data) {
      return (
        <HomeListings
          title="Some collection points"
          listings={data.listings.result}
        />
      );
    }

    return null;
  };

  // const accessToken =
  //   "pk.eyJ1IjoiYXJ0ZW1wdXN0b3ZvaXQiLCJhIjoiY2wwcDJza3F4MXU2ODNibTk1emd1MGRrMCJ9.EatApQyQ8v8siTEoggPzJQ";

  //   center: [51.509865, -0.118092],

  return (
    <Content
      className="home"
      style={{ backgroundImage: `url(${mapBackground})` }}
    >
      <HomeHero onSearch={onSearch} />

      <div className="home__cta-section">
        <Title level={2} className="home__cta-section-title">
          Your guide for all collecting points in Europe
        </Title>
        <Paragraph>
          You can open yourself a collecting point. Look at some examples here
          below.
        </Paragraph>
        <Link
          to="/listings/united%20states"
          className="ant-btn ant-btn-primary ant-btn-lg home__cta-section-button"
        >
          Dropping off in France
        </Link>
      </div>

      {renderListingsSection()}

      <div className="home__listings-img-cover">
        <script src="https://api.tiles.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.js"></script>
        <link
          href="https://api.tiles.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.css"
          rel="stylesheet"
        />
      </div>
      <div className="home__listings">
        <Title level={4} className="home__listings-title">
          Collecting Points Map
        </Title>
        {/* <div className="map">
          <MapboxMap />
        </div> */}
      </div>
      <div id="map" className="map"></div>
      <div className="home__listings">
        <Title level={4} className="home__listings-title">
          Where are you from?
        </Title>
        <Row gutter={12}>
          <Col xs={24} sm={12}>
            <Link to="/listings/san%20fransisco">
              <div className="home__listings-img-cover">
                <img
                  src={romeImage}
                  alt="San Fransisco"
                  className="home__listings-img"
                />
              </div>
            </Link>
          </Col>
          <Col xs={24} sm={12}>
            <Link to="/listings/cancún">
              <div className="home__listings-img-cover">
                <img
                  src={smallTownImage}
                  alt="Cancún"
                  className="home__listings-img"
                />
              </div>
            </Link>
          </Col>
        </Row>
      </div>
    </Content>
  );
};
