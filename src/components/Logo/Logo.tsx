import React from "react";
import { NavLink } from "react-router-dom";
import { version } from "../../../package.json";
import LogoImg from "../../assets/logo.png";
import "./Logo.scss";

const Logo: React.FC = () => {
  return (
    <NavLink className="logo no-select clickable" to="/">
      <div className="content" />
      <img src={LogoImg} />
      {window.dev && `inDEV ${version}`}
      {window.beta && "Beta ver."}
    </NavLink>
  );
};

export default Logo;
