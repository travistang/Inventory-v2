import { 
    Food, FoodContainer, 
    Unit, 
    BuyOrder 
} from './typedefs';
import md5 from 'blueimp-md5';

export const localStorageKey = 'db';

interface DataBaseType {
    foods: Array<Food & {[key: string]: any}>
};

export const initialDatabase : DataBaseType = {
    foods: []
};

const loadDatabase = () => {
    const db = localStorage.getItem(localStorageKey);
    if (!db) {
        localStorage.setItem(localStorageKey, 
            JSON.stringify(initialDatabase));
        return initialDatabase;
    } else {
        return JSON.parse(db) as DataBaseType;
    }
};

const saveDatabase = (newDb: DataBaseType) => {
    return localStorage.setItem(localStorageKey, JSON.stringify(newDb));
};

const resolvers = {
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
    },
    Food: {
        info: (food: Food) => {
            const totalAmount = food.containers.reduce(
                (sum, container) => sum + container.amount, 0
            );
            const totalCapacity = food.containers.reduce(
                (sum, container) => sum + container.capacity, 0
            );
            
            const numberOfContainers = food.containers.length;
            return {
                __typename: "FoodInfo",
                totalAmount,
                numberOfContainers,
                percentageLeft: (totalCapacity === 0) ? 0 : totalAmount / totalCapacity
            }
        }
    },
    Mutation: {
        addFood: (_: any, { name, unit } : { name: string, unit: Unit}) => {
            const db = loadDatabase();
            db.foods.push({
                __typename: "Food",
                name, unit,
                containers: [],
            });

            saveDatabase(db);
        },

        buyFood: (_: any, { buyOrders } : {buyOrders: BuyOrder[]}) => {
            const db = loadDatabase();
            const newFoodContainers : FoodContainer[] = [];
            buyOrders.forEach(buyOrder => {
                const { foodName: name, price, expiryDate, amount } = buyOrder;
                
                // locate the food this order is referring to
                const foodId = db.foods.findIndex(food => food.name === name);
                // add food to the db if it is found
                if (foodId > 0) {
                    //@ts-ignore
                    const container = {
                        __typename: "FoodContainer",
                        id: md5((new Date()).toString() + name + amount),
                        capacity: amount,
                        amount: Number.parseFloat(amount.toString()),
                        dataPurchased: new Date(),
                        expiryDate, 
                        dateOpened: null,
                        price
                    } as FoodContainer;

                    db.foods[foodId].containers.push(container);
                    newFoodContainers.push(container);
                }
            });

            saveDatabase(db);
            return newFoodContainers;
        }
    }
}
export default resolvers;
