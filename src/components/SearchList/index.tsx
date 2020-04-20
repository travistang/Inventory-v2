import React from "react";
import Input, { InputConfigProps } from "../Input";
import { CenterNoticeProps, CenterNoticeSwitch } from "../CenterNotice";
import { AnimatedDrop, AnimatedList } from "../../animations";

import "./style.scss";

type SearchGroupProps<T> = {
  list: Array<T>;
  filterFunc: (item: T, searchTerm: string) => boolean;

  minimumSearchLength?: number;
  renderItem: (item: T) => React.ReactNode;
  inputConfig: InputConfigProps;
  emptyResultConfig?: CenterNoticeProps;
  animated?: boolean;
};

const defaultEmptyResultConfig: CenterNoticeProps = {
  iconName: "search",
  title: "No results found",
};

const SearchGroup: React.FC<SearchGroupProps<any>> = ({
  list,
  filterFunc,
  renderItem,
  minimumSearchLength = 1,
  inputConfig,
  emptyResultConfig = defaultEmptyResultConfig,
  animated = false,
}) => {
  const [searchTerm, setSearchTerm] = React.useState("");

  const searchResults =
    searchTerm.length >= minimumSearchLength
      ? list.filter((item) => filterFunc(item, searchTerm))
      : list;

  const SearchInput = (
    <div className="SearchGroup-Input">
      <Input
        {...inputConfig}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e as string)}
      />
    </div>
  );

  return (
    <div className="SearchGroup">
      {animated ? <AnimatedDrop>{SearchInput}</AnimatedDrop> : SearchInput}

      <div className="SearchGroup-List">
        <CenterNoticeSwitch watch={searchResults} {...emptyResultConfig}>
          {animated ? (
            //@ts-ignore
            <AnimatedList>
              {searchResults.map((item) => renderItem(item))}
            </AnimatedList>
          ) : (
            searchResults.map((item) => renderItem(item))
          )}
        </CenterNoticeSwitch>
      </div>
    </div>
  );
};

export default SearchGroup;
