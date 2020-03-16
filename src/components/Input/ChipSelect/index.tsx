import React from 'react';
import { ValueTypes } from '../index';
import { Icon } from '@material-ui/core';
import "./style.scss";

export type Option = {
    icon?: string,
    value: ValueTypes,
    label: string
};
type ChipProps = Option & {
    selected: boolean,
    onSelect: () => void
} ;
const Chip: React.FC<ChipProps> = ({
    icon, label, 
    // value,
    selected, onSelect
}) => {
    return (
        <div 
            className={selected ? "Chip-Selected" : "Chip"} 
            onClick={onSelect}>
            { icon && <Icon>{icon}</Icon>}
            {label}
        </div>
    )
}
type ChipSelectProps = {
    value: ValueTypes,
    options: Option[],
    onSelect: (value: ValueTypes) => void
}
export const ChipSelect: React.FC<ChipSelectProps> = ({
    options, onSelect, value
}) => {
    // const [selectedOption, setSelectedOption] 
    //     = React.useState(null as ValueTypes | null);

    // console.log("chip selected option in chipSelect: " + selectedOption);

    const onChipClicked = (value: ValueTypes) => {
        // console.log('on chip clicked value: ' + value);
        // setSelectedOption(value);
        onSelect(value);
    }

    return (
        <div className="ChipSelect-Container">
            {
                options.map(option => (
                    <Chip {...option} 
                        key={option.label}
                        selected={value === option.value}
                        onSelect={() => onChipClicked(option.value)}
                    />
                ))
            }
        </div>
    )
};

