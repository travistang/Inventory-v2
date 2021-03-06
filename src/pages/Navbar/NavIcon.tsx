import React from 'react';
import { Icon } from '@material-ui/core';

export type NavIconProps = {
    title: string,
    icon: string,
    path: string,
    active?: Boolean
};

const NavIcon: React.FC<NavIconProps> = ({
    title, icon, path, active
}) => {
    return (
        <div className="NavIcon-Container">
            <div className={`NavIcon ${active?"NavIcon-Active":""}`}>
                <Icon style={{color: active?"primary":"text"}}>{icon}</Icon>
                {' '}
            </div>
        </div>
    )
};

export default NavIcon;