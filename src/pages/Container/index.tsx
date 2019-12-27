import React from 'react';
import CenterNotice from '../../components/CenterNotice';
import { withHeader } from '../Header';

const ContainerPage: React.FC = () => (
    <div className="Page">
        <CenterNotice iconName="work-outline" title="Coming Soon!" />
    </div>
)

export default withHeader(ContainerPage, {
    title: "Containers",
    navButtons: [
        {
            iconName: "add",
            onClick: () => {}
        }
    ]
});