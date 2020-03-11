import React from 'react';
import { FoodContainer } from '../../data/typedefs';
import { Icon } from '@material-ui/core';
import { isTimeInPast } from '../../utils';
import _ from 'lodash';

const STATUS_COLOR = {
    UNOPENED: {
        color: 'white',
        icon: "kitchen"
    },
    UNOPENED_EXPIRED: {
        color: 'white',
        icon: "delete_forever"
    },
    OPENED: {
        color: 'orange',
        icon: "kitchen"
    },
    OPENED_EXPIRED: {
        color: 'orange',
        icon: "delete_forever"
    }
}

type StatusTypes = keyof typeof STATUS_COLOR;

type ContainerOverviewProps = {
    containers: FoodContainer[]
};
const ContainerOverview: React.FC<ContainerOverviewProps> = ({
    containers
}) => {
    const statusList : { status : keyof typeof STATUS_COLOR}[] = containers.map(({
        expiryDate,
        dateOpened,
    }, i) => {

        let status = Object.keys(STATUS_COLOR)[0] as StatusTypes;
        const expired = !!expiryDate && isTimeInPast(expiryDate);
        const opened  = !!dateOpened;

        if (expired) {
            status = opened ? "OPENED_EXPIRED" : "UNOPENED_EXPIRED";
        } else {
            status = opened ? "OPENED" : "UNOPENED";
        }

        return { status }
    });

    const counts = _.groupBy(statusList, "status");

    return (
        <>
            {
                (
                    Object.keys(counts).sort((a, b) => counts[a].length - counts[b].length) as (keyof typeof STATUS_COLOR)[]
                ).map(status => (
                    <div style={{
                        color: STATUS_COLOR[status].color, 
                        display: 'flex', 
                        alignItems: 'center', 
                        marginRight: 4 
                    }}>
                        <Icon style={{color: STATUS_COLOR[status].color }}>
                            {STATUS_COLOR[status].icon} 
                        </Icon>
                        {counts[status].length > 1 && `x ${counts[status].length}`}
                    </div>
                ))
            }
        </>
    );
};

export default ContainerOverview;