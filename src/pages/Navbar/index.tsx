import React from "react";
import NavIcon, { NavIconProps } from "./NavIcon";
import { useLocation, useHistory, RouteComponentProps } from "react-router-dom";
import Routes from '../../routes';
import "./style.scss";

const navItems: Array<NavIconProps> = [
    {
        title: "Containers",
        icon: "work-outline",
        path: Routes.CONTAINERS_LIST,
    },
    {
        title: "Home",
        icon: "home",
        path: Routes.HOME
    },
    {
        title: "Food",
        icon: "fastfood",
        path: Routes.FOOD_LIST
    },
    {
        title: "Buy",
        icon: "shopping-cart",
        path: Routes.BUY_FOOD
    }
];


const NavBar: React.FC = () => {
    const location = useLocation();
    const history  = useHistory();
    return (
        <div className="NavBarContainer">
            {
                navItems.map(props => (
                    <div onClick={() => history.push(props.path as string)}>
                        <NavIcon {...props} active={(location.pathname[1] || '/').startsWith(props.path[1] || '/')}  />
                    </div>
                ))
            }
        </div>
    )
}

export default NavBar;