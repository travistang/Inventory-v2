import React from 'react';
import { Icon } from '@material-ui/core';
import './style.scss';

type NavButtonProps = {
    iconName: string,
    onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
};

type HeaderProps = {
    title: string,
    navButtons?: Array<NavButtonProps>
};

const Header: React.FC<HeaderProps> = ({
    title, navButtons
}) => {
    return (
        <div className="Header">
            {title}
            <div className="Header-NavButtonGroup">
                {
                    navButtons && navButtons.map(({iconName, onClick}) => (
                        <div className="Header-NavButton" onClick={onClick}>
                            <Icon>{iconName}</Icon>
                        </div>
                    ))                    
                }
            </div>
        </div>
    )
}

/*
    Add arbitrary page with a header.
    Also provides `setHeaderTitle` to allow the page components to dynamically adjust the title name
*/
export const withHeader = (WrappedComponent: React.FC<any>, headerProps: HeaderProps) => {
    const Component = (props: React.Props<any>) => {
        const [ customTitle, setHeaderTitle ] = React.useState(null);

        return (
            <>
                <Header 
                    {...headerProps} 
                    {...(customTitle && {title: customTitle})} 
                />
                <WrappedComponent {...props} setHeaderTitle={setHeaderTitle} />
            </>
        )
    }
    return Component;
}

export default Header;