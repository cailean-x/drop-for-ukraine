import React, { useState, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Input, Layout } from "antd";
import { displayErrorMessage } from "../../lib/utils";
import { Viewer } from "../../lib/types";
import { MenuItems } from "./components";
import styled from "styled-components";
import SearchIcon from "assets/search.svg";
import logo from "./assets/javelina-logo.jpg";

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

const { Header } = Layout;
const { Search } = Input;

export const AppHeader = ({ viewer, setViewer }: Props) => {
  const [search, setSearch] = useState("");

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const { pathname } = location;
    const pathnameSubStrings = pathname.split("/");

    if (!pathname.includes("/listings")) {
      setSearch("");
      return;
    }

    if (pathname.includes("/listings") && pathnameSubStrings.length === 3) {
      setSearch(pathnameSubStrings[2]);
      return;
    }
  }, [location]);

  const onSearch = (value: string) => {
    const trimmedValue = value.trim();

    if (trimmedValue) {
      history.push(`/listings/${trimmedValue}`);
    } else {
      displayErrorMessage("Please enter a valid search!");
    }
  };

  return (
    <body>
    <div className="top__bttn">
        <a href="#" className="donation-link">
            <p className="top__bttn-text">Support Ukraine - donate to buy a Bayraktar dron</p>
        </a>
    </div>
    {/* <Header className="app-header">
      <div className="app-header__logo-search-section">
        <div className="app-header__logo">
          <Link to="/">
            <img src={logo} alt="App logo" />
          </Link>
        </div>
        <StyledSearch
          placeholder="Search city"
          value={search}
          onChange={(evt) => setSearch(evt.target.value)}
          onSearch={onSearch}
          allowClear
        />
      </div>
      <div className="app-header__menu-section">
        <MenuItems viewer={viewer} setViewer={setViewer} />
      </div>
    </Header> */}
    </body>
  );
};

const StyledSearch = styled(Search)`
  position: relative;
  width: 386px;
  max-width: 100%;

  font-family: 'Rubik';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;

  .ant-input {
    height: auto;
    padding: 10px 48px;
    color: #02020B;
    position: relative;
    background: #FFFFFF !important;
    border: 1px solid #F2F2F2;
    box-shadow: 0px 13px 10px rgba(50, 50, 71, 0.05), 0px 22px 28px rgba(50, 50, 71, 0.05);
    border-radius: 500px;

    &::placeholder {
      color: #757575;
    }

    &:focus + .ant-input-suffix {
      display: flex;
    }

    &:hover {
      border-color: #D2E6F7 !important;
    }

    &:focus {
      border-color: #4095DA !important;
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
    content: '';
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