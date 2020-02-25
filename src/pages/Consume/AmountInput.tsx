import React from 'react';
import Form, { FormLayout } from '../../components/Form';

const AmountInterpretationType = {
    "Amount Used": 0,
    "Amount Left": 1,
    "Percentage Left": 2,
    "All": 3
};

type FormValueType = {
    amount: number;
    interpretationType: keyof typeof AmountInterpretationType;
};

const formLayout: FormLayout = [
    [{
        name: "amount",
        label: "Amount",
        type: "number",
        iconName: "fitness_center"
    }],
    [{
        name: "interpretationType",
        label: "Interpret amount as...",
        type: "select",
        options: Object.keys(AmountInterpretationType),
        iconName: "comment"
    }]
];

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
        interpretationType: Object.keys(AmountInterpretationType)[0]
    }
    const [form, setForm] = React.useState(initialFormValue);

    // derived properties
    const realValue = (() => {
        const type = AmountInterpretationType[form.interpretationType];
        switch(type) {
            case 0:
                return form.amount;
            case 1:
                return capacity - form.amount;
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
            <Form 
                initialValue={initialFormValue}
                layout={formLayout}
                withSubmitButton={false}
                submitIconName="check"
                submitButtonText="Consume"
                setFormValue={form => setForm(form as FormValueType)}
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