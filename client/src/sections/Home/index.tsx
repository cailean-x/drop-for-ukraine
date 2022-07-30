import React, {useState} from "react";
import { Link, useHistory } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { Col, Row, Layout, Typography, Input } from "antd";
import { LISTINGS } from "../../lib/graphql/queries";
import {
  Listings as ListingsData,
  ListingsVariables,
} from "../../lib/graphql/queries/Listings/__generated__/Listings";
import { ListingsFilter } from "../../lib/graphql/globalTypes";
import { useScrollToTop } from "../../lib/hooks";
import { displayErrorMessage } from "../../lib/utils";
import { HomeHero, HomeListings, HomeListingsSkeleton } from "./components";
import styled from "styled-components";

import mapBackground from "./assets/map-background.jpg";
import romeImage from "./assets/rome.jpg";
import smallTownImage from "./assets/small-town.jpg";
import MapboxMap from "./components/MapBox";
import SearchIcon from "./assets/icon.search.svg";

const { Content } = Layout;
const { Paragraph, Title } = Typography;
const { Search } = Input;

const PAGE_LIMIT = 4;
const PAGE_NUMBER = 1;

export const Home = () => {
  const [search, setSearch] = useState("");
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

  const onSearch = (value: string) => {
    const trimmedValue = value.trim();

    if (trimmedValue) {
      history.push(`/listings/${trimmedValue}`);
    } else {
      displayErrorMessage("Please enter a valid search!");
    }
  };

  return (
    <body className="home-page__body">
      <div className="search__container">
        <h3 className="search__container-title">
          The easy way to drop off humanitarian aid for Ukraine
        </h3>
        <div className="search__container-bar">
        <StyledSearch
          placeholder="Search city"
          value={search}
          onChange={(evt) => setSearch(evt.target.value)}
          onSearch={onSearch}
          allowClear
        />
        </div>
        <div className="search__container-tip">
          <p>
            {" "}
            Frequent in searches:{" "}
            <a href="#" className="search-link">
              {" "}
              Lublin
            </a>
            ,{" "}
            <a href="#" className="search-link">
              Berlin
            </a>
            ,{" "}
            <a href="#" className="search-link">
              London
            </a>
            ,{" "}
            <a href="#" className="search-link">
              Vilnius
            </a>
          </p>
        </div>
      </div>

      <main className="main">
        <div className="hero__container">
          <h1 className="hero-title">
            Select the city where you want to find a humanitarian collection
            points
          </h1>

          <div className="cities__bar">
            <a href="#" className="city__bar-item-link">
              <div className="city__bar-item">
                <div className="city__bar-item-img">
                  <img src="./imgs/paris.svg" alt="" />
                </div>
                <div className="city__bar-item-text">
                  <h5 className="city__bar-item-title">Paris</h5>
                  <p className="city__bar-item-points">23 points</p>
                </div>
              </div>
            </a>
            <a href="#" className="city__bar-item-link">
              <div className="city__bar-item">
                <div className="city__bar-item-img">
                  <img src="./imgs/lublin.svg" alt="" />
                </div>
                <div className="city__bar-item-text">
                  <h5 className="city__bar-item-title">Lublin</h5>
                  <p className="city__bar-item-points">44 points</p>
                </div>
              </div>
            </a>
            <a href="#" className="city__bar-item-link">
              <div className="city__bar-item">
                <div className="city__bar-item-img">
                  <img src="./imgs/berlin.svg" alt="" />
                </div>
                <div className="city__bar-item-text">
                  <h5 className="city__bar-item-title">Berlin</h5>
                  <p className="city__bar-item-points">37 points </p>
                </div>
              </div>
            </a>
            <a href="#" className="city__bar-item-link">
              <div className="city__bar-item">
                <div className="city__bar-item-img">
                  <img src="./imgs/london.svg" alt="" />
                </div>
                <div className="city__bar-item-text">
                  <h5 className="city__bar-item-title">London </h5>
                  <p className="city__bar-item-points">76 points</p>
                </div>
              </div>
            </a>
            <a href="#" className="city__bar-item-link">
              <div className="city__bar-item">
                <div className="city__bar-item-img">
                  <img src="./imgs/vilnus.svg" alt="" />
                </div>
                <div className="city__bar-item-text">
                  <h5 className="city__bar-item-title">Vilnius</h5>
                  <p className="city__bar-item-points">29 points</p>
                </div>
              </div>
            </a>
            <a href="#" className="city__bar-item-link">
              <div className="city__bar-item">
                <div className="city__bar-item-img">
                  <img src="./imgs/rome.svg" alt="" />
                </div>
                <div className="city__bar-item-text">
                  <h5 className="city__bar-item-title">Rome</h5>
                  <p className="city__bar-item-points">16 points </p>
                </div>
              </div>
            </a>
          </div>
          <div className="cards__container">
            <h3 className="most-visited-places">
              Most visited collection points
            </h3>
            <div className="collection__cards__grid">
              <div className="collection__cards__item add">
                <div className="collection__cards__wrapper">
                  <p className="collection__cards-text">
                    Here you can place your own collection point
                  </p>
                  <a href="">
                    <img
                      src="./imgs/bttn add.svg"
                      alt=""
                      className="bttn-add"
                    />
                  </a>
                  <p className="collection__cards-text">
                    Add a collection point
                  </p>
                </div>
              </div>
              <div className="collection__cards__item">
                <div className="collection__cards__img__wrapper">
                  <img src="./imgs/grid-card-2.png" alt="" />
                </div>
                <div className="collection__cards__text__wrapper">
                  <div className="count-info">
                    <img src="./imgs/Ellipse 63.svg" alt="" />
                    <img src="./imgs/Vector (6).svg" className="person-icon" />
                    <p className="count__info-text">32</p>
                  </div>
                  <img
                    src="./imgs/img.avatar.svg"
                    alt=""
                    className="cards-icon"
                  />
                  <h3 className="cards__item-title">
                    FACRO accepts humanitarian aid for Ukraine
                  </h3>
                  <p className="cards__item-text square">1,050 m2</p>
                  <p className="cards__item-text location">
                    Warsaw, Poland, Partyzantow 98A
                  </p>
                </div>
              </div>
              <div className="collection__cards__item">
                <div className="collection__cards__img__wrapper">
                  <img src="./imgs/grid-card-3.png" alt="" />
                </div>
                <div className="collection__cards__text__wrapper">
                  <div className="count-info">
                    <img src="./imgs/Ellipse 63.svg" alt="" />
                    <img src="./imgs/Vector (6).svg" className="person-icon" />
                    <p className="count__info-text">78</p>
                  </div>
                  <img
                    src="./imgs/grid-icon-2.svg"
                    alt=""
                    className="cards-icon"
                  />
                  <h3 className="cards__item-title">
                    FACRO accepts humanitarian aid for Ukraine
                  </h3>
                  <p className="cards__item-text square">1,120 m2</p>
                  <p className="cards__item-text location">
                    Warsaw, Poland, Mickiewicza Adama 78
                  </p>
                </div>
              </div>
              <div className="collection__cards__item">
                <div className="collection__cards__img__wrapper">
                  <img src="./imgs/grid-card-4.png" alt="" />
                </div>
                <div className="collection__cards__text__wrapper">
                  <div className="count-info">
                    <img src="./imgs/Ellipse 63.svg" alt="" />
                    <img src="./imgs/Vector (6).svg" className="person-icon" />
                    <p className="count__info-text">51</p>
                  </div>
                  <img
                    src="./imgs/grid-icon-3.svg"
                    alt=""
                    className="cards-icon"
                  />
                  <h3 className="cards__item-title">
                    FACRO accepts humanitarian aid for Ukraine
                  </h3>
                  <p className="cards__item-text square">788 m2</p>
                  <p className="cards__item-text location">
                    Warsaw, Poland, Dabrowszczakow 83A
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </body>
    // <Content
    //   className="home"
    //   style={{ backgroundImage: `url(${mapBackground})` }}
    // >
    //   <HomeHero onSearch={onSearch} />

    //   <div className="home__cta-section">
    //     <Title level={2} className="home__cta-section-title">
    //       Your guide for all collecting points in Europe
    //     </Title>
    //     <Paragraph>
    //       You can open yourself a collecting point. Look at some examples here
    //       below.
    //     </Paragraph>
    //     <Link
    //       to="/listings/united%20states"
    //       className="ant-btn ant-btn-primary ant-btn-lg home__cta-section-button"
    //     >
    //       Dropping off in France
    //     </Link>
    //   </div>

    //   {renderListingsSection()}

    //   <div className="home__listings-img-cover"></div>
    //   <div className="home__listings">
    //     <Title level={4} className="home__listings-title">
    //       Collecting Points Map
    //     </Title>
    //   </div>
    //   <MapboxMap type="main" />
    //   <div className="home__listings">
    //     <Title level={4} className="home__listings-title">
    //       Where are you from?
    //     </Title>
    //     <Row gutter={12}>
    //       <Col xs={24} sm={12}>
    //         <Link to="/listings/san%20fransisco">
    //           <div className="home__listings-img-cover">
    //             <img
    //               src={romeImage}
    //               alt="San Fransisco"
    //               className="home__listings-img"
    //             />
    //           </div>
    //         </Link>
    //       </Col>
    //       <Col xs={24} sm={12}>
    //         <Link to="/listings/cancún">
    //           <div className="home__listings-img-cover">
    //             <img
    //               src={smallTownImage}
    //               alt="Cancún"
    //               className="home__listings-img"
    //             />
    //           </div>
    //         </Link>
    //       </Col>
    //     </Row>
    //   </div>
    // </Content>
  );
};

const StyledSearch = styled(Search)`
  position: relative;
  width: 386px;
  max-width: 100%;

  font-family: "Rubik";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;

  .ant-input {
    height: auto;
    padding: 10px 48px;
    color: #02020b;
    position: relative;
    background: #ffffff !important;
    border: 1px solid #f2f2f2;
    box-shadow: 0px 13px 10px rgba(50, 50, 71, 0.05),
      0px 22px 28px rgba(50, 50, 71, 0.05);
    border-radius: 500px;

    &::placeholder {
      color: #757575;
    }

    &:focus + .ant-input-suffix {
      display: flex;
    }

    &:hover {
      border-color: #d2e6f7 !important;
    }

    &:focus {
      border-color: #4095da !important;
    }
  }

  .ant-input-suffix {
    right: 20px;
    display: none;

    &:active {
      display: flex !important;
    }
  }

  .ant-input-search-icon {
    display: none;
  }

  &::after {
    content: "";
    display: inline-flex;
    width: 13px;
    height: 13px;
    background-image: url(${SearchIcon});
    background-repeat: no-repeat;
    background-size: contain;
    position: absolute;
    left: 22px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 100;
  }
`;
