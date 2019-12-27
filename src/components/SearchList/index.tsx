import React from 'react';
import Input, {InputConfigProps} from '../Input';
import { 
    CenterNoticeProps, 
    CenterNoticeSwitch 
} from '../CenterNotice';
import "./style.scss";

type SearchGroupProps<T> = {
        list: Array<T>,
        filterFunc: (item: T, searchTerm: string) => boolean
        
        minimumSearchLength?: number,
        renderItem: (item: T) => React.ReactNode,
        inputConfig?: InputConfigProps,
        emptyResultConfig?: CenterNoticeProps,
}

const defaultEmptyResultConfig: CenterNoticeProps = {
    iconName: "search",
    title: "No results found"
}

const SearchGroup: React.FC<SearchGroupProps<any>> = ({
    list, filterFunc, renderItem,
    minimumSearchLength = 1,
    inputConfig = {},
    emptyResultConfig = defaultEmptyResultConfig
}) => {
    const [searchTerm, setSearchTerm] = React.useState("");

    const searchResults = (searchTerm.length >= minimumSearchLength)?
        list.filter(item => filterFunc(item, searchTerm)):list;

    return (
        <div className="SearchGroup">
            <div className="SearchGroup-Input">
                <Input 
                    {...inputConfig} 
                    value={searchTerm} 
                    onChange={setSearchTerm}
                />
            </div>
            <div className="SearchGroup-List">
                <CenterNoticeSwitch 
                    watch={searchResults} 
                    {...emptyResultConfig}
                >
                    { 
                           searchResults.map(item => renderItem(item))
                    }
                </CenterNoticeSwitch>
            </div>
        </div>
    )
    return null;
}

export default SearchGroup;