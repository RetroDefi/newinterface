import React from "react";
import { NavLink } from "react-router-dom";

const Nav: React.FC = () => {
  return (
    <div className="topbar-nav no-select">
      <NavLink className="item clickable" activeClassName="active" to="/earn">
        Earn
      </NavLink>
      <NavLink className="item clickable" activeClassName="active" to="#">
        Create LP
      </NavLink>
      <NavLink className="item clickable" activeClassName="active" to="#">
        Tutorials
      </NavLink>
      <NavLink className="item clickable" activeClassName="active" to="#">
        Docs
      </NavLink>
      <NavLink className="item clickable" activeClassName="active" to="#">
        Lucky Qbert
      </NavLink>
      {/*<a className='item clickable' href='https://vote.pancakebunny.finance' target='_blank' rel='noopener noreferrer'>Vote</a>*/}
      {/*<a className='item clickable' href='https://docs.pancakebunny.finance' target='_blank' rel='noopener noreferrer'>Wiki</a>*/}
    </div>
  );
};

export default Nav;
