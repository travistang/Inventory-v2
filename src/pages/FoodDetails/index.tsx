import React from 'react';
import AuxInfo, { AuxInfoProps } from './auxInfo';
import ListInfoItem, { ListInfoItemProps} from './listInfoItem';
import { Price } from '../../data/types';
import { useHeader } from '../Header';
import Routes from '../../routes';
import { useLocation, useHistory } from "react-router-dom";
import { CenterNoticeSwitch } from '../../components/CenterNotice';
import ContainerCard from '../../components/ContainerCard';

import { gql } from '@apollo/client';
import { useQuery } from '@apollo/react-hooks';

import "./style.scss";

const FOOD_DETAIL_QUERY = gql`
    query foodDetails($food: String!) {
        food(name: $food) @client {
            name
            unit
            containers {
                capacity
                amount
                datePurchased
                expiryDate
                dateOpened
                price

                expired
                opened
                percentageLeft
            }
            info {
                numberOfContainers
                expiredContainers
                openedContainers
                totalAmount
                totalWorth
                percentageLeft
            }
        }
    }
`;
type QueryResultType = {
    name: string,
    unit: string,
    containers: [{
        capacity: number,
        amount: number,
        datePurchased: Date,
        expiryDate?: Date,
        dateOpened?: Date,
        price: Price,

        expired: boolean,
        opened: boolean,
        percentageLeft: number
    }],
    info: {
        numberOfContainers: number,
        expiredContainers: number,
        openedContainers: number,
        totalAmount: number,
        totalWorth: number,
        percentageLeft: number
    }
}
const FoodDetailsPage: React.FC = () => {
    const history  = useHistory();
    const location = useLocation();
    const { navOptions, setNavOptions } = useHeader();

    const foodName = new URLSearchParams(location.search).get('food');
    const { loading, error, data } = useQuery(FOOD_DETAIL_QUERY, {
        variables: {
            food: foodName
        }
    });

    if(!foodName) history.goBack();

    React.useEffect(() => {
        setNavOptions({
            ...navOptions,
            title: foodName as string,
            withBackButton: true,
            navButtons: [{ 
                iconName: "edit", 
                onClick: () => history.push({
                    pathname: Routes.FOOD_EDIT,
                    search: `?food=${foodName}`
                })
            }]
        });
    }, []);

    if (loading) {
        return null;
    }

    if (error) {
        alert(error.message);
        return null;
    }

    const food = data.food as QueryResultType;
    // things to render under the main trendbar
    const auxConfigs: AuxInfoProps[] = [
        {
            title: 'Total Amount',
            iconName: 'kitchen',
            value: `${food.info.totalAmount} ${food.unit}`
        },
        {
            title: 'Worth',
            iconName: 'money',
            value: `${food.info.totalWorth}€`
        },
        {
            title: "Percentage Left",
            iconName: "percentage",
            value: `${food.info.percentageLeft}%`
        }
    ];

    const listInfoConfigs: ListInfoItemProps[] = [
        {
            color: 'white',
            iconName: "kitchen",
            description: "Unopened Containers",
            value: (food.info.numberOfContainers - food.info.openedContainers).toString()
        },
        {
            color: 'orange',
            iconName:"kitchen",
            description: "Opened Containers",
            value: (food.info.openedContainers).toString()
        },
        {
            color: 'red',
            iconName:"delete_forever",
            description: "Expired Containers",
            value: (food.info.expiredContainers).toString()
        }
    ];

    return (
        <div className="FoodDetails-Container">
            {/*
                Top section
            */}
             <div className="FoodDetails-TopSection">
                 <h6>Summary</h6>
                 <div className="FoodDetails-TopSection-AuxInfoRow">
                     {
                         auxConfigs.map(config => (
                             <AuxInfo key={config.title} {...config} />
                         ))
                     }
                 </div>
                 {
                     food.info.numberOfContainers > 0 && (
                        <div className="FoodDetails-TopSection-LIstInfoRow">
                            {
                                listInfoConfigs.map((config, i) => (
                                    <ListInfoItem {...config} key={i} />
                                ))
                            }
                        </div>
                     )
                 }
             </div>

             <div className="FoodDetails-BottomSection">
                <CenterNoticeSwitch 
                    watch={food.containers}
                    iconName="kitchen"
                    title="No Containers"
                    subtitle="Use the buy food function to add containers of this food"
                >
                    <>
                        <h6>{food.info.numberOfContainers} Container(s) </h6>
                        {
                            food.containers.map(
                                (container) => <ContainerCard container={container} unit={food.unit} />
                            )
                        }
                    </>
                </CenterNoticeSwitch>
             </div>
        </div>
    )
}

export default FoodDetailsPage;