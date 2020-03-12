import React from 'react';
import { FormValueType } from "../../components/Form";
import { InputTypes, ValueTypes } from "../../components/Input";
/**
 * Component containing forms for a small subset of questions to be filled out in a wizard.
 */
type QuestionStepProps = {
    questionNames: {name: string, type: InputTypes, initialValue: ValueTypes}[],
    onChange: (name: string, value: ValueTypes) => void,
    onNextStep: () => void
}
const QuestionStep: React.FC<QuestionStepProps> = ({
    questionNames, onChange, onNextStep
}) => {

    const initialValues = Object.assign({}, ...questionNames.map(
        ({ name, initialValue}) => ({name: initialValue})
    ));

    const [ form, setForm ] = React.useState(initialValues);

    return (
        <div className="QuestionStep-Container">

        </div>
    );
}

export default QuestionStep;