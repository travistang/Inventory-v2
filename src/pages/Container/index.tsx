import React from 'react';
import { withHeader } from '../Header';

const ContainerPage: React.FC = () => {
    return <div>Hello world</div>;
};

export default withHeader(ContainerPage,{
    title: "Assets",
    navButtons: [
        {
            iconName: "add",
            onClick: () => {}
        }
    ]
});