import React from 'react';
import Input, { InputTypes, ValueTypes, ChipSelect, Option } from "../../../components/Input";
import "./style.scss";

/**
 * Component containing forms for a small subset of questions to be filled out in a wizard.
 */
export type Question = {
    name: string,
    type: InputTypes,
    questionText: string,
    // for select fields only
    options?: Option[]
}
type QuestionStepProps = {
    form: {[key: string]: ValueTypes},
    questions: Question[],
    onChange: (name: string, value: ValueTypes) => void
}
const QuestionStep: React.FC<QuestionStepProps> = ({
    questions, onChange, form
}) => {
    return (
        <div className="QuestionStep-Container">
            {
                questions.map(({ name, type, questionText, options}) => (
                    <div className="QuestionStep-QuestionContainer" key={name}>
                        <div className="QuestionStep-QuestionText">{questionText}</div>
                        {
                            type === 'select' ? (
                                <ChipSelect 
                                    value={form[name]}
                                    options={options as Option[]}
                                    onSelect={opt => onChange(name, opt)}
                                />
                            ) : (
                                <Input 
                                    type={type}
                                    name={name}
                                    value={form[name]} 
                                    onChange={v => {
                                        onChange(name, v); 
                                    }}
                                />
                            )
                        }
                    </div>
                ))
            }
        </div>
    );
}

export default QuestionStep;