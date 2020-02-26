import React from "react";
import NavIcon, { NavIconProps } from "./NavIcon";
import { useLocation, useHistory } from "react-router-dom";
import Routes from '../../routes';
import "./style.scss";

const navItems: Array<NavIconProps> = [
    {
        title: "Assets",
        icon: "work-outline",
        path: Routes.CONTAINERS_LIST,
    },
    {
        title: "Consume",
        icon: "whatshot",
        path: Routes.CONSUME
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
    }, 
    {
        title: "Settings",
        icon: "settings",
        path: Routes.SETTINGS
    }
];


const NavBar: React.FC = () => {
    const location = useLocation();
    const history  = useHistory();
    return (
        <div className="NavBarContainer">
            {
                navItems.map((props, i) => (
                    <div key={i} onClick={() => history.push(props.path as string)}>
                        <NavIcon {...props} active={
                                (location.pathname.split('/app')[1] || '/app')
                                .startsWith(props.path.split('/app')[1] || '/app')
                            }  
                        />
                    </div>
                ))
            }
        </div>
    )
}

export default NavBar;