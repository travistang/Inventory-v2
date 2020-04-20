import React from "react";
import NavIcon, { NavIconProps } from "./NavIcon";
import { useLocation, useHistory } from "react-router-dom";
import Routes, {PageNames} from '../../routes';
import "./style.scss";

const navItems: Array<NavIconProps & {tag: string[]}> = [
    {
        title: "Records",
        icon: "history",
        path: Routes.RECORDS,
        tag: [PageNames.RECORDS]
    },
    {
        title: "Consume",
        icon: "whatshot",
        path: Routes.CONSUME,
        tag: [PageNames.CONSUME]
    },
    {
        title: "Food",
        icon: "fastfood",
        path: Routes.FOOD_LIST,
        tag: [
            PageNames.FOOD_LIST, 
            PageNames.FOOD_ADD, 
            PageNames.FOOD_DETAILS
        ]
    },
    {
        title: "Buy",
        icon: "shopping-cart",
        path: Routes.BUY_FOOD,
        tag: [PageNames.BUY_FOOD]
    }, 
    {
        title: "Settings",
        icon: "settings",
        path: Routes.SETTINGS,
        tag: [PageNames.SETTINGS]
    }
];


const NavBar: React.FC = () => {
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const history  = useHistory();
    return (
        <div className="NavBarContainer">
            {
                navItems.map(({tag, ...props}, i) => (
                    <div key={i} onClick={() => history.push(props.path as string)}>
                        <NavIcon {...props} active={tag.indexOf(query.get('page') || "") > -1} />
                    </div>
                ))
            }
        </div>
    )
}

export default NavBar;