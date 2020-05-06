import {
    Food,
    BuyRecord,
    ConsumeRecord
} from '../typedefs';

export const localStorageKey = 'db';

interface DataBaseType {
    // extra object key: value pair is for __typename
    foods: Array<Food & {[key: string]: any}>;
    records: Array<(BuyRecord | ConsumeRecord) & {[key: string]: any}> 
};

export const initialDatabase : DataBaseType = {
    foods: [],
    records: []
};

export const loadDatabase = () => {
    const db = localStorage.getItem(localStorageKey);
    if (!db) {
        localStorage.setItem(localStorageKey, 
            JSON.stringify(initialDatabase));
            return initialDatabase;
        } else {
        return JSON.parse(db) as DataBaseType;
    }
};

export const saveDatabase = (newDb: DataBaseType) => {
    return localStorage.setItem(localStorageKey, JSON.stringify(newDb));
};

export const correctDatabase = () => {
    const db = loadDatabase();
    // add list if it doesnt exist
    if (!db.foods) {
        db.foods = [];
    }
    if (!db.records) {
        db.records = [];
    }
    
    db.foods.forEach((food, i, foodList) => {
        if (!food.containers) {
            foodList[i].containers = [];
        }
        if (!food.stockLevel) {
            food.stockLevel = 0;
        }
    });
    saveDatabase(db);
}