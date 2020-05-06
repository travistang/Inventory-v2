import {
    loadDatabase
} from './db';

const Queries = {
    Query: {
        food: (_: any, { name }: { name: string }) => {
            const db = loadDatabase();
            const food = db.foods.find(food => food.name === name);
            return food;
        },
        foods: () => {
            const db = loadDatabase();
            return db.foods;
        },
        records: (_: any, { type }: { type: string }) => {
            const db = loadDatabase();
            return db.records.filter(({ __typename }) => __typename === type);
        }
    },
};

export default Queries;