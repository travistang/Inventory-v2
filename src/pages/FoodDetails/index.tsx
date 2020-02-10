import React from 'react';
import Trend from 'react-trend';
import AuxInfo, { AuxInfoProps } from './auxInfo';
import { Food } from '../../data/types';
import TrendLine from '../../components/TrendLine';
import { useHeader } from '../Header';
import Routes from '../../routes';
import { useLocation, useHistory } from "react-router-dom";
import { CenterNoticeSwitch } from '../../components/CenterNotice';

import "./style.scss";

type FoodDetailsProps = {
    food: Food
}
 
const FoodDetailsPage: React.FC<FoodDetailsProps> = () => {
    const history  = useHistory();
    const location = useLocation();
    const { navOptions, setNavOptions } = useHeader();

    React.useEffect(() => {
        setNavOptions({
            ...navOptions, 
            navButtons: [{ 
                iconName: "edit", 
                onClick: () => history.push(
                    Routes.FOOD_EDIT, { 
                        food: {
                            ...food,
                            dateToUseAfterOpen: food.latestOpenDays()
                        }
                })
            }]
        });
    }, []);

    const food = location.state && (location.state.food as Food);
    if (!food || !food.totalWorth) {
        history.push(Routes.CONTAINERS_LIST);
        return null;
    }
    
    // things to render under the main trendbar
    const auxConfigs: Array<AuxInfoProps> = [
        {
            title: 'Containers',
            iconName: 'kitchen',
            value: food.containers.length
        },
        {
            title: 'Days to open',
            iconName: 'calendar',
            value: (() => {
                const days = food.latestOpenDays();
                return days || '--';
            })()
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
                 <div className="FoodDetails-TopSection-TrendContainer">
                    <TrendLine
                        data={food.getTotalAmountHistory()}
                    />
                    <div>
                        <AuxInfo 
                            title="Amount" iconName="fitness_center" 
                            value={`${food.totalAmount()} ${food.unit}`}
                        />
                        <AuxInfo
                            title="Remaining" 
                            value={`${food.remainingFoodPercentage().toFixed(2)} %`}
                        />
                    </div>
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
                    subtitle="Use the buy food function to add containers of this food"
                >
                    {
                        food.containers.map(({capacity}) => <div>{capacity}</div>)
                    }
                </CenterNoticeSwitch>
             </div>
        </>
    )
}

export default FoodDetailsPage;