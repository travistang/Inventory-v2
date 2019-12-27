// as a test of the backend logic
import React from 'react';
import {
    Recordable
} from '../data/types';

const Playground: React.FC = () => {
    const [recordables, setRecordables] = React.useState([new Recordable()]);
    return (
        <div>
            {
                recordables.map(rec => <div>{rec.id}</div>)
            }
        </div>
    )
};

export default Playground;