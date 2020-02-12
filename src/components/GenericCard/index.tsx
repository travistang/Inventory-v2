import React from 'react';
import "./style.scss";

type GenericCardProps = {
    mainText: string,
    rightComponent: React.ReactNode,
    smallComponent?: React.ReactNode,
    onClick?: () => void
};

const GenericCard: React.FC<GenericCardProps> = ({
    mainText, rightComponent, smallComponent, onClick
}) => {
    return (
        <div className="GenericCard" onClick={onClick}>
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
    )
}

export default GenericCard;