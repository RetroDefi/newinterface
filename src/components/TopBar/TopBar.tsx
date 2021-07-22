import React from "react";
import Popup from "reactjs-popup";
import { Menu } from "react-feather";
import AccountButton from "../AccountButton/AccountButton";
import Nav from "./components/Nav";
import Container from "../Container";
import Logo from "../Logo";
import BunnyPrice from "../BunnyPrice/BunnyPrice";
import { colorWhite } from "../../colors";
import popclose from "../../assets/svg/popup-close.svg";
import qbertpop from "../../assets/tokens/qbertpxl.png";
import qbertcopy from "../../assets/svg/copy.svg";
import "./TopBar.scss";

interface TopBarProps {
  onPresentMobileMenu: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onPresentMobileMenu }) => {
  return (
    <div>
      <Container size="lg">
        <div className="topbar">
          <div className="logo-wrapper">
            <Logo />
          </div>

          <div className="nav-wrapper">
            <Nav />
          </div>

          <div className="account-wrapper">
            <BunnyPrice />
            <Popup
              trigger={
                <a
                  className="btn small primary buy-qbert"
                  aria-describedby="popup-2"
                  style={{ marginRight: "20px" }}
                >
                  {" "}
                  QBERT Stats{" "}
                </a>
              }
              modal
              nested
            >
              {(close) => (
                <div className="popup-container visible">
                  <div
                    id="popup-buy-qbert"
                    className="popup"
                    style={{ display: "block" }}
                  >
                    <div className="header">
                      <div className="ttl">Your Qbert</div>
                      <img
                        className="btn close"
                        src={popclose}
                        onClick={close}
                      />
                    </div>
                    <div className="content">
                      <img src={qbertpop} />
                      <div className="balance">0</div>

                      <div className="key-value">
                        <div className="key">Price</div>
                        <div className="value qbert-price">$0</div>
                      </div>
                      <div className="key-value mt-10">
                        <div className="key">Current Supply</div>
                        <div className="value qbert-supply">0</div>
                      </div>
                      <div className="key-value mt-10">
                        <div className="key">Market Cap</div>
                        <div className="value market-cap">-</div>
                      </div>
                      <div className="key-value mt-10">
                        <div className="key">Contract Address</div>
                        <div className="value qbert-contract">
                          <span />
                          <img className="copy" src={qbertcopy} />
                        </div>
                      </div>
                      <a
                        className="chart"
                        target="_blank"
                        href="https://dex.guru/token/0x6ed390befbb50f4b492f08ea0965735906034f81-bsc"
                      >
                        View chart
                      </a>
                      <a
                        className="btn primary buy"
                        target="_blank"
                        href="https://exchange.pancakeswap.finance/#/swap?outputCurrency=0x6ED390Befbb50f4b492f08Ea0965735906034F81"
                      >
                        Buy QBERT
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </Popup>
            <AccountButton />
          </div>

          <div className="menu-wrapper" onClick={onPresentMobileMenu}>
            <Menu size={36} color={colorWhite} />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default TopBar;
