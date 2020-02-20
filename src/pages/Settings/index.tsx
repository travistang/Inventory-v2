import React from 'react';
import { withHeader } from '../Header';
import "./style.scss";
import { toast } from 'react-toastify';
import { localStorageKey, initialDatabase } from '../../data/resolvers';

type ButtonWithDescriptionRowProps = {
    title: string,
    description: string,
    buttonTitle: string,
    onClick?: () => void
}
const ButtonWithDescriptionRow: React.FC<ButtonWithDescriptionRowProps> = ({
    title, description, buttonTitle, onClick 
}) => {
    return (
        <div className="Settings-DescriptionRow">
            <div className="Settings-DescriptionRowLeft">
                <div className="Settings-DescriptionRowTitle">
                    {title}
                </div>
                <div className="Settings-DescriptionRowDescription">
                    {description}
                </div>
            </div>
            <div className="Settings-DescriptionRowRight">
                <div className="Settings-DescriptionRowButton" onClick={onClick}>
                    { buttonTitle }
                </div>
            </div>
        </div>
    );
}

const settingsConfig: ButtonWithDescriptionRowProps[] = [
    {
        title: "Reset Database",
        description: "Remove all data you have saved in the local storage. This can not be undone.",
        buttonTitle: "Remove",
        onClick: () => {
            window.localStorage.setItem(localStorageKey, JSON.stringify(initialDatabase));
            toast.info("Database has been reset.", {
                autoClose: 3000,
                onClose: () => window.location.reload()
            });
        }
    },
    {
        title: "Validate Database",
        description: "Validate the values in the current database and try to correct it.",
        buttonTitle: "Validate"
    },
];

const SettingsPage: React.FC = () => {
    return (
        <div className="Settings-Container">
            {
                settingsConfig.map((settings, i) => (
                    <ButtonWithDescriptionRow 
                        key={i}
                        {...settings}
                    />
                ))
            }
        </div>
    );
}

export default withHeader(SettingsPage, {
    title: "Settings"
});