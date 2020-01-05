import React from 'react';
import AuxInfo, { AuxInfoProps } from './auxInfo';
import { Food, FoodContainer } from '../../data/types';
import { withHeader, WithHeaderProps } from '../Header';
import Routes from '../../routes';
import { useLocation, useHistory } from "react-router-dom";
import { CenterNoticeSwitch } from '../../components/CenterNotice';

import "./style.scss";

type FoodDetailsProps = {
    food: Food
}
 
const FoodDetailsPage: React.FC<WithHeaderProps & FoodDetailsProps> = ({
    navOptions, setNavOptions
}) => {
    const history  = useHistory();
    const location = useLocation();
    
    const food = location.state.food as Food;
    if (!food) throw new Error("Food must be provided to Food details' page");
    
    React.useEffect(() => {
        setNavOptions({...navOptions, 
            navButtons: [{ iconName: "edit", onClick: () => history.push(Routes.FOOD_ADD, { food })}]
        });
    }, []);
    
    // things to render under the main trendbar
    const auxConfigs: Array<AuxInfoProps> = [
        {
            title: 'Containers',
            iconName: 'kitchen',
            value: food.containers.length
        },
        {
            title: 'Amount',
            iconName: 'fitness_center',
            value: `${food.totalAmount()} ${food.unit}`
        },
        {
            title: 'Worth',
            iconName: 'money',
            value: `${food.totalWorth("EUR").amount}€`
        }
    ];
    return (
        <>
            {/*
                Top section
            */}

             <div className="FoodDetails-TopSection">
                 <div className="FoodDetails-TopSection-Title">
                    { food.name }
                 </div>
                 <div className="FoodDetails-TopSection-AuxInfoRow">
                     {
                         auxConfigs.map(config => (
                             <AuxInfo key={config.title} {...config} />
                         ))
                     }
                 </div>
             </div>
             <div className="FoodDetails-BottomSection">
                <CenterNoticeSwitch 
                    watch={food.containers}
                    iconName="kitchen"
                    title="No Containers"
                    subtitle="Use the buy food function to add containers to this food"
                >
                    {
                        food.containers.map(({capacity}) => <div>{capacity}</div>)
                    }
                </CenterNoticeSwitch>
             </div>
        </>
    )
}

const FoodDetailsPageWithHeader = withHeader(FoodDetailsPage, {
    title: "",
    withBackButton: true
});

export default FoodDetailsPageWithHeader;