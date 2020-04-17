import React from 'react';
import { Icon } from '@material-ui/core';
import { useHistory } from 'react-router';
import constate from 'constate';
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

// custom hooks
export function useHeaderHook() {
    const [ navOptions, setNavOptions] = React.useState({
        title: "",
        withBackButton: false
    } as HeaderProps);

    return { navOptions, setNavOptions } ;
};

export const [HeaderContextProvider, useHeader] = constate(useHeaderHook);

const Header: React.FC = () => {
    const { 
        navOptions: {
            title, navButtons, withBackButton
        }
    } = useHeader();

    const history = useHistory();
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

export const HeaderContainer: React.FC = ({ children }) => {
    return (
        <HeaderContextProvider>
            <Header/>
            {children}
        </HeaderContextProvider>
    )
};

export const withHeader = (WrappedComponent : React.FC<any>, newNavOptions : HeaderProps) => {
    const Component: React.FC = props => {
        const {setNavOptions} = useHeader();
        React.useEffect(() => {
            setNavOptions(newNavOptions);
        }, [setNavOptions]);

        return <WrappedComponent {...props} />
    }

    return Component;
}
export default Header;