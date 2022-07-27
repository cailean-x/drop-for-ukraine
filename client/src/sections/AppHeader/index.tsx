import React, { useState, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Input, Layout } from "antd";
import { displayErrorMessage } from "../../lib/utils";
import { Viewer } from "../../lib/types";
import { MenuItems } from "./components";
import styled from "styled-components";
import SearchIcon from "assets/search.svg";
import logo from "./imgs/header-logo.svg";
import divider from "./imgs/divider vertical.svg";

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
          <p className="top__bttn-text">
            Support Ukraine - donate to buy a Bayraktar dron
          </p>
        </a>
      </div>
      <header className="header">
        <div className="container">
          <div className="header__container">
            <div className="header-logo">
              <img src={logo} alt="" />
            </div>
            <div className="header__buttons">
              <div className="language__button">
                <a href="#" className="language">
                  EN
                </a>
              </div>
              <div className="divider"> <img src={divider} alt="" /></div>
              <div className="collection__button">
                <a href="#" className="collection__button-link">
                  <p className="collection__button-text">
                    {" "}
                    Add collection point
                  </p>
                </a>
              </div>
              <span className="sing-in__button">
                <a href="#" className="sing-in__button-link">
                  Sign in
                </a>
              </span>
              <a href="#" className="sing-in__button-link">
                <svg
                  width="25"
                  className="sing-in-icon"
                  height="25"
                  viewBox="0 0 25 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11.5455 8.41826C11.4394 8.45665 11.2963 8.52904 11.2275 8.57908C11.1587 8.62911 11.0529 8.76699 10.9924 8.88541C10.9251 9.01698 10.8828 9.18719 10.8834 9.32277C10.884 9.44485 10.9257 9.63276 10.9761 9.74037C11.0313 9.85819 11.3909 10.257 11.8804 10.743L12.6931 11.5501L6.6888 11.5745C1.21322 11.5968 0.671485 11.6061 0.537665 11.6802C0.456962 11.7249 0.333071 11.8239 0.262395 11.9003C0.191719 11.9767 0.105488 12.0941 0.0708591 12.1613C0.0361813 12.2284 0.0078125 12.4045 0.0078125 12.5527C0.0078125 12.7009 0.0361813 12.8771 0.0708591 12.9442C0.105488 13.0114 0.191719 13.1288 0.262395 13.2052C0.333071 13.2816 0.456962 13.3806 0.537665 13.4253C0.671485 13.4994 1.21322 13.5087 6.6888 13.531L12.6931 13.5554L11.8804 14.3624C11.3909 14.8485 11.0313 15.2473 10.9761 15.3651C10.9257 15.4727 10.884 15.655 10.8834 15.7702C10.8828 15.8854 10.9162 16.0607 10.9575 16.1597C10.9989 16.2587 11.0705 16.3814 11.1165 16.4324C11.1626 16.4833 11.2883 16.5707 11.3959 16.6266C11.5231 16.6927 11.6801 16.7275 11.8446 16.726C12.0258 16.7245 12.1578 16.6882 12.3092 16.5983C12.4256 16.5293 13.0524 15.9374 13.7021 15.2831C14.3517 14.6288 14.9523 13.9834 15.0366 13.8489C15.121 13.7144 15.2332 13.4644 15.2861 13.2935C15.3507 13.0844 15.3821 12.8419 15.3821 12.5527C15.3821 12.2636 15.3507 12.0211 15.2861 11.812C15.2332 11.641 15.121 11.3911 15.0366 11.2566C14.9523 11.1221 14.3517 10.4767 13.7021 9.82239C13.0524 9.16806 12.4328 8.58138 12.3252 8.51872C12.2176 8.45602 12.0415 8.39204 11.9339 8.37659C11.8168 8.35976 11.6608 8.37649 11.5455 8.41826Z"
                    fill="#4095DA"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M20.877 24.9655C21.0502 24.9426 21.3468 24.8768 21.5361 24.8193C21.7254 24.7619 21.9908 24.659 22.126 24.5907C22.2612 24.5225 22.4708 24.3991 22.5919 24.3165C22.7129 24.234 22.9302 24.0554 23.0747 23.9196C23.2192 23.7838 23.4334 23.5383 23.5508 23.374C23.6683 23.2098 23.8305 22.9339 23.9114 22.7609C23.9924 22.588 24.1083 22.2602 24.169 22.0325L24.2793 21.6185V12.4966V3.37471L24.169 2.96072C24.1083 2.73299 23.9924 2.4052 23.9114 2.23225C23.8305 2.0593 23.6683 1.78339 23.5508 1.61915C23.4334 1.45485 23.2192 1.20937 23.0747 1.07355C22.9302 0.937771 22.707 0.754843 22.5787 0.666998C22.4503 0.579205 22.2082 0.443182 22.0406 0.364779C21.873 0.286373 21.5599 0.172215 21.3446 0.111076L20.9534 0H15.4753H9.99731L9.60603 0.111076C9.39082 0.172215 9.07764 0.286373 8.91003 0.364779C8.74246 0.443182 8.50035 0.579205 8.37201 0.666998C8.24371 0.754843 8.02048 0.937771 7.876 1.07355C7.73152 1.20937 7.51724 1.45485 7.39985 1.61915C7.28242 1.78339 7.12052 2.05851 7.04001 2.23053C6.95956 2.4025 6.84569 2.7193 6.78705 2.93451C6.6902 3.28989 6.67998 3.4493 6.67587 4.67085C6.67338 5.41062 6.6882 6.07601 6.70874 6.14952C6.72933 6.22298 6.81512 6.36169 6.89944 6.45771C6.98377 6.55372 7.12101 6.66773 7.20441 6.71107C7.2901 6.75553 7.47322 6.78981 7.62514 6.78981C7.7749 6.78981 7.9592 6.75572 8.04088 6.71292C8.12158 6.67062 8.24547 6.57353 8.31615 6.49713C8.38682 6.42078 8.47482 6.30325 8.51165 6.23599C8.56173 6.14463 8.58545 5.77344 8.60556 4.76867C8.62717 3.68788 8.64816 3.38346 8.71238 3.21917C8.7563 3.10677 8.83069 2.9527 8.8777 2.87679C8.9247 2.80093 9.04179 2.654 9.13785 2.55026C9.23396 2.44652 9.39825 2.30669 9.50302 2.23953C9.60774 2.17233 9.81478 2.07563 9.96308 2.02462C10.2213 1.93579 10.4553 1.93184 15.4753 1.93184C20.4954 1.93184 20.7294 1.93579 20.9876 2.02462C21.1359 2.07563 21.3429 2.17233 21.4476 2.23953C21.5524 2.30669 21.7167 2.44652 21.8128 2.55026C21.9089 2.654 22.0264 2.80157 22.0739 2.87821C22.1214 2.95485 22.2023 3.13988 22.2538 3.2894C22.3445 3.55318 22.3473 3.82557 22.3473 12.4966C22.3473 21.1676 22.3445 21.44 22.2538 21.7038C22.2023 21.8533 22.1214 22.0383 22.0739 22.115C22.0264 22.1916 21.9089 22.3392 21.8128 22.4429C21.7167 22.5467 21.5524 22.6865 21.4476 22.7536C21.3429 22.8208 21.1359 22.9175 20.9876 22.9686C20.7294 23.0574 20.4954 23.0613 15.4753 23.0613C10.4553 23.0613 10.2213 23.0574 9.96308 22.9686C9.81478 22.9175 9.60774 22.8208 9.50302 22.7536C9.39825 22.6865 9.23396 22.5467 9.13785 22.4429C9.04179 22.3392 8.9247 22.1922 8.8777 22.1164C8.83069 22.0405 8.7563 21.8864 8.71238 21.774C8.64816 21.6097 8.62717 21.3053 8.60556 20.2245C8.58545 19.2197 8.56173 18.8485 8.51165 18.7572C8.47482 18.6899 8.38682 18.5724 8.31615 18.496C8.24547 18.4196 8.12158 18.3226 8.04088 18.2803C7.9592 18.2375 7.7749 18.2034 7.62514 18.2034C7.47322 18.2034 7.2901 18.2377 7.20441 18.2821C7.12101 18.3254 6.98377 18.4395 6.89944 18.5355C6.81512 18.6315 6.72933 18.7702 6.70874 18.8437C6.6882 18.9172 6.67338 19.5826 6.67587 20.3223C6.67998 21.5439 6.6902 21.7033 6.78705 22.0587C6.84569 22.2739 6.95956 22.5907 7.04001 22.7626C7.12052 22.9347 7.28242 23.2098 7.39985 23.374C7.51724 23.5383 7.73152 23.7838 7.876 23.9196C8.02048 24.0554 8.24371 24.2383 8.37201 24.3262C8.50035 24.414 8.74246 24.55 8.91003 24.6284C9.07764 24.7068 9.39082 24.8205 9.60603 24.8811L9.99731 24.9912L15.2797 24.9992C18.185 25.0036 20.7038 24.9885 20.877 24.9655Z"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </header>
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
