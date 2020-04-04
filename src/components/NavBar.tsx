import React from 'react';
import {Navbar, NavbarBrand} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import "../assets/bootstrap-switch-button.css";


type  NavProps = {
  title: string
  onClickTitle?: any
  back?: any
  onToggle?: any
  toggleChecked?: boolean
}

const NavBar = ({title, onClickTitle, back, onToggle, toggleChecked}: NavProps) => {


  return (
    <Navbar
      style={{marginRight: "auto", marginLeft: "auto", maxWidth: "1000px"}}
      className={"justify-content-between"}
      bg="info"
      variant="dark"
      fixed="top">
      { back &&
      <div style={{width: "70px", textAlign: "left"}}>
        <FontAwesomeIcon onClick={back} icon={faArrowLeft} size={"2x"}/>
      </div>
      }
      <NavbarBrand style={{fontSize: "x-large"}} onClick={onClickTitle}>
        { title.length < 20 ? title : title.slice(0,19) + "..." }
      </NavbarBrand>
      { onToggle
        ?
          <BootstrapSwitchButton
              checked={toggleChecked}
              onlabel="All"
              onstyle="secondary"
              offlabel="Todo"
              offstyle="primary"
              width={70}
              onChange={onToggle}
          />
        :
          <div style={{width: "70px"}}/>
      }
    </Navbar>
  )

};

export default NavBar