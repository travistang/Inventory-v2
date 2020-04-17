import React from 'react';
import Input, { ChipSelect } from '../../components/Input';
const AmountInterpretationType : {[key: string]: number} = {
    "Amount Used": 0,
    "Amount Left": 1,
    "Percentage Left": 2,
    "All": 3
};

type FormValueType = {
    amount: number;
    interpretationType: keyof typeof AmountInterpretationType;
};

type AmountInputProps = {
    unit: string;
    amount: number;
    capacity: number;
    onAmountChosen: (amount: number) => void
}
const AmountInput: React.FC<AmountInputProps> = ({
    amount, capacity, onAmountChosen, unit
}) => {
    const initialFormValue: FormValueType = {
        amount: 0,
        //@ts-ignore
        interpretationType: Object.values(AmountInterpretationType)[0]
    }
    const [form, setForm] = React.useState(initialFormValue);

    // derived properties
    const realValue = (() => {
        const type = form.interpretationType;
        switch(type) {
            case 0:
                return form.amount;
            case 1:
                return amount - form.amount;
            case 2:
                return parseFloat((amount - capacity * (form.amount / 100)).toFixed(2));
            default:
                return amount;
        }
    })();

    const percentLeft = (amount - realValue) / capacity * 100;

    // report new amount when values changed
    React.useEffect(() => {
        onAmountChosen(realValue);
    }, [realValue, onAmountChosen]);

    return (
        <div className="AmountInput-Container">
            <Input 
                type="number"
                value={form.amount}
                name="amount"
                label="Amount"
                onChange={v => setForm({...form, amount: parseFloat(v as string) || 0})}
            />
            <p>Interpret amount as...</p>
            <ChipSelect 
            
                options={Object.keys(AmountInterpretationType).map(key => ({
                    label: key,
                    value: AmountInterpretationType[key]
                }))}
                value={form.interpretationType} 
                //@ts-ignore
                onSelect={v => setForm({...form, interpretationType: v})}
            />
            <div className="AmountInput-Summary">
                Remaining: {'  '}
                <div className="AmountInput-SummaryText">
                    {(amount - realValue).toFixed(2)} {unit} ({percentLeft.toFixed(1)} %)
                </div>
            </div>
        </div>
    );
};

export default AmountInput;