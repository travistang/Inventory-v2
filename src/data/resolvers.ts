import { 
    Food, FoodContainer, 
    Unit, 
    BuyOrder 
} from './typedefs';
import md5 from 'blueimp-md5';

const localStorageKey = 'db';

interface DataBaseType {
    foods: Array<Food & {[key: string]: any}>
};

const loadDatabase = () => {
    const db = localStorage.getItem(localStorageKey);
    if (!db) {
        const initialDatabase : DataBaseType = {
            foods: []
        }
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
            return db.foods.find(food => food.name === name) 
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
                
                db.foods.forEach(function (food, index) {
                    if (food.name === name) {
                        //@ts-ignore
                        const container = {
                            __typename: "FoodContainer",
                            id: md5((new Date()).toString() + name + amount),
                            capacity: amount,
                            amount,
                            dataPurchased: new Date(),
                            expiryDate, 
                            dateOpened: null,
                            price
                        } as FoodContainer;
                        
                        //@ts-ignore
                        this[index].containers.push(container);
                        newFoodContainers.push(container);
                    }
                });
            });

            saveDatabase(db);
            return newFoodContainers;
        }
    }
}
export default resolvers;
