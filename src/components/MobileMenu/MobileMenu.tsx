import React from "react";
import { NavLink } from "react-router-dom";
import { X } from "react-feather";
import BunnyPrice from "../BunnyPrice/BunnyPrice";
import AccountButton from "../AccountButton/AccountButton";
import { colorWhite } from "../../colors";
import "./MobileMenu.scss";

interface MobileMenuProps {
  onDismiss: () => void;
  visible?: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ onDismiss, visible }) => {
  if (visible) {
    return (
      <div className="mobile-menu-wrapper">
        <div className="mobile-menu-backdrop" onClick={onDismiss} />
        <div className="mobile-menu">
          <div className="header no-select">
            <div className="empty" />
            <AccountButton />
            <div className="close clickable" onClick={onDismiss}>
              <X color={colorWhite} size={24} />
            </div>
          </div>

          <NavLink
            className="item clickable"
            activeClassName="active"
            to="/earn"
            onClick={onDismiss}
          >
            Earn
          </NavLink>
          <NavLink
            className="item clickable"
            activeClassName="active"
            to="#"
            onClick={onDismiss}
          >
            Create LP
          </NavLink>
          <NavLink
            className="item clickable"
            activeClassName="active"
            to="#"
            onClick={onDismiss}
          >
            Tutorials
          </NavLink>
          <NavLink
            className="item clickable"
            activeClassName="active"
            to="#"
            onClick={onDismiss}
          >
            Docs
          </NavLink>
          <NavLink
            className="item clickable"
            activeClassName="active"
            to="#"
            onClick={onDismiss}
          >
            Lucky QBERT
          </NavLink>
          {/*<a className='item clickable' href='https://vote.pancakebunny.finance' target='_blank' rel='noopener noreferrer'>Vote</a>*/}
          {/*<a className='item clickable' href='https://docs.pancakebunny.finance' target='_blank' rel='noopener noreferrer'>Wiki</a>*/}

          <div className="footer no-select clickable">
            <BunnyPrice />
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default MobileMenu;
