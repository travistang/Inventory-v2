import React from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/react-hooks';
import { withHeader } from '../Header';
import { CenterNoticeSwitch } from '../../components/CenterNotice';
import { BuyRecord, ConsumeRecord } from '../../data/typedefs';
import RecordsSummary from './RecordSummary';
import { AnimatedList } from '../../animations';

import RecordItem from './RecordItem';

import "./style.scss";

const QUERY_ALL_RECORDS = gql`
    query getAllRecords {
        buyRecord: records(type: "BuyRecord") @client {
            date
            buyOrder {
                foodName
                price
                amount
            }
        }

        consumeRecord: records(type: "ConsumeRecord") @client {
            date
            consumeOrder {
                amount
            }
            foodName
            equivalentPrice
        }
    }
`;

const RecordsPage = () => {
    const { data } = useQuery(QUERY_ALL_RECORDS);
    
    const allRecords = React.useMemo(() => (
        (data?.buyRecord || []).concat(data?.consumeRecord || [])
    ), [data]) as Array<BuyRecord | ConsumeRecord>;

    return (
        <CenterNoticeSwitch 
            watch={allRecords} iconName="history"
            title="No Records" 
            subtitle="Buy or consume some food to get some."
        >
            <div className="RecordPage-Container">
                <RecordsSummary buyRecords={data?.buyRecord} consumeRecords={data?.consumeRecord} />
                <div className="RecordList-Container">
                    <AnimatedList>
                        {
                            allRecords.map((record) => <RecordItem record={record} />)
                        }
                    </AnimatedList>
                </div>
            </div>
        </CenterNoticeSwitch>
    );
};

export default withHeader(RecordsPage, {
    title: "Records"
});
