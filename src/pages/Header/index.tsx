import React from 'react';
import { Icon } from '@material-ui/core';
import { withRouter, RouteComponentProps } from 'react-router';
import './style.scss';

type NavButtonProps = {
    iconName: string,
    onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
};

type HeaderProps = {
    title: string,
    withBackButton?: boolean,
    navButtons?: Array<NavButtonProps>
};

export type WithHeaderProps = {
    setNavOptions: (opt: HeaderProps) => void;
    navOptions: HeaderProps;
    setHeaderTitle: (newTitle: string) => void;
}

const HeaderBase: React.FC<HeaderProps & RouteComponentProps<any>> = ({
    title, navButtons, withBackButton = false,
    history
}) => {
    return (
        <div className="Header">
            <div>
                {
                    withBackButton && (
                            <Icon style={{fontSize: 32}} onClick={() => history.goBack()}>navigate_before</Icon>
                    )
                }
                {title}
            </div>
            
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

const Header = withRouter(HeaderBase);
/*
    Add arbitrary page with a header.
    Also provides `setHeaderTitle` to allow the page components to dynamically adjust the title name
*/
export const withHeader = (WrappedComponent: React.FC<any>, headerProps: HeaderProps) => {
    const Component = (props: React.Props<any>) => {
        const [ customTitle, setHeaderTitle ] = React.useState(null);
        const [ navOptions, setNavOptions ] = React.useState(headerProps);
        return (
            <>
                <Header 
                    {...navOptions} 
                    {...(customTitle && {title: customTitle})} 
                />
                <WrappedComponent {...props} 
                    navOptions={navOptions}
                    setNavOptions={setNavOptions}
                    setHeaderTitle={setHeaderTitle} />
            </>
        )
    }
    return Component;
}

export default Header;