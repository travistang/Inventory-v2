import React from 'react';
import CenterNotice from '../../components/CenterNotice';
import { withHeader } from '../Header';

const ContainerPage: React.FC = () => {
    return <CenterNotice iconName="shopping-cart" title="Coming Soon!" />
}

export default withHeader(ContainerPage, {
    title: "Buy",
    navButtons: [
        {
            iconName: "add",
            onClick: () => {}
        }
    ]
});