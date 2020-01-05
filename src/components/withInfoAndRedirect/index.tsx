import React from 'react';
import { Icon } from '@material-ui/core';
import { withRouter, RouteComponentProps } from 'react-router';
import "./style.scss";
/**
 * HOC that shows toast and possibliy redirect after n seconds
 */

export type ToastConfig = {
    message: string;
    iconName?: string;
    color: string;
}

const Toast: React.FC<ToastConfig> = ({
    message, iconName, color: backgroundColor
}) => (
    <div className="Toast" style={{backgroundColor}}>
        {iconName && <Icon>{iconName}</Icon>}
        {' '}
        {message}
    </div>
);

export type ToastInfoAndRedirectConfig = {
    showToast: (config: ToastConfig, forTime: number) => void;
    showToastAndRedirect: (config: ToastConfig, toURL: string, delay: number) => void;
}

const withInfoAndRedirect = (WrappedComponent: React.FC<ToastInfoAndRedirectConfig>) => {
    const Component = ({history, ...props}: RouteComponentProps<any>) => {
        const [ toastConfig, setToastConfig ] = React.useState(null as ToastConfig | null);

        // functional component
        const showToastCallback: (config: ToastConfig, forTime: number) => void = (config, time) => {
            setToastConfig(config);
            setTimeout(() => setToastConfig(null), time);
        };

        const showToastAndRedirect: (config: ToastConfig, toURL: string, delay: number) => void = (
            config, toURL, delay
        ) => {
            setToastConfig(config);
            setTimeout(() => history.push(toURL), delay);
        }

        return (
            <>
                { toastConfig && (
                    <Toast {...(toastConfig || {})} />
                )}
                <WrappedComponent {...props} 
                    showToast={showToastCallback} 
                    showToastAndRedirect={showToastAndRedirect} />
            </>
        )
    }

    return Component;
}

export default (WrappedComponent: React.FC) => withRouter(withInfoAndRedirect(WrappedComponent));