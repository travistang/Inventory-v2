import React from 'react';
import { Icon } from '@material-ui/core';
import "./style.scss";

export type GenericCardExtraProps = {
    actionButton?: {
        iconName: string,
        onClick: () => void
    }
};

export type GenericCardProps = GenericCardExtraProps & {
    mainText: string,
    rightComponent: React.ReactNode,
    smallComponent?: React.ReactNode,
    onClick?: () => void,
    style?: object
};

const GenericCard: React.FC<GenericCardProps> = ({
    mainText, rightComponent, smallComponent, onClick,
    actionButton,
    style
}) => {
    return (
        <div className="GenericCard" onClick={onClick} style={style}>
            {
                actionButton && (
                    <div className="GenericCard-ActionButton">
                        <div onClick={actionButton.onClick}>
                            <Icon >{actionButton.iconName}</Icon>
                        </div>
                    </div>
                )
            }
            <div className="GenericCard-Left">
                <div className="GenericCard-MainText">{mainText}</div>
                <div className="GenericCard-containers">
                    { smallComponent }
                </div>
            </div>
            
            <div className="GenericCard-Right">
                { rightComponent }
            </div>
        </div>
    );
}

export default GenericCard;