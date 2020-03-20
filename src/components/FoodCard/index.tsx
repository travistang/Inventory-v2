import React from 'react';
import { Icon } from '@material-ui/core';
import { withRouter, RouteComponentProps } from 'react-router';
import GenericCard, { GenericCardExtraProps } from '../GenericCard';
import ContainerOverview from './ContainerOverview';
import { FoodContainer } from '../../data/typedefs';
import "./style.scss";

type FoodCardProps = GenericCardExtraProps & {
    name: string,
    unit: string,
    containers: FoodContainer[],
    info: {
        totalAmount: number,
        numberOfContainers: number,
        understock?: boolean
    },
    onClick?: () => void
};

const SmallInfo = ({ 
    icon, value, style 
}: { icon?: string, value: number | string, style?: any}) => (
    <div className="FoodCard-SmallInfo" style={style}>
        { icon && <Icon>{icon}</Icon> }
        { value }
    </div>
);

const FoodCard: React.FC<FoodCardProps & RouteComponentProps<any>> = ({
    name, unit, info, onClick, containers, ...props
}) => {
    const rightComponent = <SmallInfo value={`${info.totalAmount} ${unit}`} style={{fontSize: 18}} />;
    const smallComponent = !info.numberOfContainers ?
         "No containers" :
         <ContainerOverview containers={containers} />;

    
    // const cardStyle = info.understock ? {backgroundColor: 'rgba(255, 0, 0, 0.3)'} : {};
    return (
        <GenericCard 
            mainText={name} 
            rightComponent={info.understock ? (
                <div className="FoodCard-RightComponent">
                    {rightComponent}
                    <div className="FoodCard-UnderstockText">
                        Understock
                    </div>
                </div>
            ) : rightComponent} 
            smallComponent={smallComponent} 
            onClick={onClick}
            {...props}
        />
    );
}

export default withRouter(FoodCard);