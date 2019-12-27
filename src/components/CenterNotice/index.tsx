import React from 'react';
import { Icon } from '@material-ui/core';
import './style.scss';

export type CenterNoticeProps = {
    iconName: string,
    title?: string, 
    subtitle?: string
};

type CenterNoticeSwitchProps = CenterNoticeProps & {
    watch: Array<any> | boolean,
    children: any
}
const CenterNotice: React.FC<CenterNoticeProps> = ({
    iconName, title, subtitle
}) => {
    return (
        <div className="CenterNotice">
            <Icon style={{fontSize: 72}}>{iconName}</Icon>
            <div style={{textAlign: 'center'}}>
                {
                    title && <h3>{title}</h3>
                }
                {
                    subtitle && <h6>{subtitle}</h6>
                }
            </div>
        </div>
    );
};

export const CenterNoticeSwitch: React.FC<CenterNoticeSwitchProps> = ({
    watch, children, ...centerNoticeProps
}) => {
    if((watch as Array<any>).length === 0 || !(watch as boolean)) {
        return (<CenterNotice {...centerNoticeProps} />);
    } else {
        return children;
    }
}

export default CenterNotice;