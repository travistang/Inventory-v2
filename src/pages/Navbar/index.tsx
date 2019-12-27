import React from "react";
import NavIcon, { NavIconProps } from "./NavIcon";
import { withRouter, RouteComponentProps } from "react-router-dom";
import "./style.scss";

const navItems: Array<NavIconProps> = [
    {
        title: "Containers",
        icon: "work-outline",
        path: "/containers",
    },
    {
        title: "Home",
        icon: "home",
        path: "/"
    },
    {
        title: "Food",
        icon: "fastfood",
        path: "/food"
    }
];


const NavBar: React.FC<RouteComponentProps<any> > = ({
   location, history
}) => {
    return (
        <div className="NavBarContainer">
            {
                navItems.map(props => (
                    <div onClick={() => history.push(props.path as string)}>
                        <NavIcon {...props} active={location.pathname === props.path}  />
                    </div>
                ))
            }
        </div>
    )
}

export default withRouter(NavBar);