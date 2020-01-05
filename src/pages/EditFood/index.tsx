import React from 'react';
import { formLayout } from '../CreateFood';
import { Food } from '../../data/types';
import { ToastInfoAndRedirectConfig } from '../../components/withInfoAndRedirect';

type EditFoodPageProps = ToastInfoAndRedirectConfig & {
    editFood: (food: Food) => void;
}