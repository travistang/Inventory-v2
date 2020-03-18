import React from 'react';
import { Price } from '../../data/typedefs';
import { Icon } from '@material-ui/core';
import PercentageBar from '../../components/PercentageBar';
import { getDifferenceInDaysFromNow, roundNumber } from '../../utils';
import "./style.scss";

type ContainerCardProps = {
    container: {
        capacity: number;
        amount: number;
        datePurchased: Date;
        expiryDate?: Date;
        dateOpened?: Date;
        price: Price;

        opened: boolean;
        expired: boolean;
        percentageLeft: number;
    },
    unit: string,
    onClick?: () => void;
};
const ContainerCard : React.FC<ContainerCardProps> = ({
    container: {
        capacity, amount, datePurchased, expiryDate,
        dateOpened, price, opened, expired, percentageLeft
    },
    unit, onClick
}) => {
    
    const color = expired ? "red" : (opened ? "info" : "text");
    const containerIcon = expired ? "delete_forever" : "kitchen";

    const expireDateString = () => {
        if(!expiryDate) return "";
        const daysDiff = getDifferenceInDaysFromNow(expiryDate);
        if (expired) return `| Expired ${daysDiff} day(s) ago`;
        else return `| Expire in ${daysDiff} days`;
    };

    return (
        <div onClick={onClick} className={`ContainerCard-Container ContainerCard-Container-${color}`}>
            <div className="ContainerCard-ContainerLeft">
                {getDifferenceInDaysFromNow(datePurchased)} days old
                <Icon style={{color, fontSize: 32}}>{containerIcon}</Icon>
                {roundNumber(price.amount)} {price.currency}
            </div>
            <div className="ContainerCard-ContainerRight">
                <div className="ContainerCard-ContainerRightUp">
                    {percentageLeft.toFixed(2)}%
                    <PercentageBar color={color} percentageLeft={percentageLeft} />
                </div>
                <div className="ContainerCard-ContainerRightBottom">
                    {
                        dateOpened ? (
                            <>
                                <Icon>broken_image</Icon> 
                                <h6>{new Date(dateOpened).toLocaleDateString()}</h6>
                            </>
                        ) : (
                            <>
                                <Icon>check</Icon> 
                                <h6>Unopened</h6>
                            </>
                        )
                    }
                    <h6 style={{color}}>
                        { expireDateString() }
                    </h6>
                    { /* Small buffer here */}
                    <div className="ContainerCard-Amount">
                        {amount} {unit}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContainerCard;