import React from 'react';
import { FoodContainer } from '../../data/typedefs';
import { Icon } from '@material-ui/core';

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
    const now = new Date().getDate();

    const icons = containers.map(({
        expiryDate,
        dateOpened,
    }, i) => {

        let status = Object.keys(STATUS_COLOR)[0] as StatusTypes;
        const expired = !!expiryDate && new Date(expiryDate).getDate() > now;
        const opened  = !!dateOpened;

        if (expired) {
            status = opened ? "OPENED_EXPIRED" : "UNOPENED_EXPIRED";
        } else {
            status = opened ? "OPENED" : "UNOPENED";
        }

        const { icon, color } = STATUS_COLOR[status];
        return (
            <Icon key={i} style={{color}}>{icon}</Icon>
        );
    });

    return (
        <>
            {icons}
        </>
    );
};

export default ContainerOverview;