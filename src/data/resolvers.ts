import { 
    Food, FoodContainer, 
    Unit, Price,
    BuyOrder,
    ConsumeOrder 
} from './typedefs';
import { 
    convertToFloat, 
    randomString, 
    roundNumber, 
    isTimeInPast 
} from '../utils';

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

export const correctDatabase = () => {
    const db = loadDatabase();
    if (!db.foods) {
        db.foods = [];
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
    FoodContainer: {
        datePurchased: (container: FoodContainer) => {
            return new Date(container.datePurchased);
        },
        opened: (container: FoodContainer) => {
           return !!container.dateOpened;
        },
        expired: (container: FoodContainer) => {
            return (!!container.expiryDate) && isTimeInPast(container.expiryDate);
        },
        percentageLeft: (container: FoodContainer) => {
            return container.amount / container.capacity * 100;
        }
    },
    Food: {
        info: (food: Food) => {
            const totalAmount = food.containers.reduce(
                (sum, container) => sum + container.amount, 0
            );
            const totalCapacity = food.containers.reduce(
                (sum, container) => sum + container.capacity, 0
            );
            
            const expiredContainers = food.containers.filter(
                container => container.expiryDate && new Date(container.expiryDate).getDate() < (new Date()).getDate()
            ).length;

            const openedContainers = food.containers.filter(
                container => !!container.dateOpened
            ).length;

            const totalWorth = food.containers.reduce(
                (sum, { price }) => sum + new Price(price.amount, price.currency).as("EUR").amount, 
                0);
            const numberOfContainers = food.containers.length;

            const percentageLeft = (totalCapacity === 0) ? 
                0 : 
                totalAmount / totalCapacity * 100;
            
            const understock = food.stockLevel && food.stockLevel > totalAmount;

            return {
                __typename: "FoodInfo",
                numberOfContainers,
                expiredContainers,
                openedContainers,
                totalAmount,
                totalWorth,
                percentageLeft,
                understock
            };
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
                if (foodId > -1) {
                    //@ts-ignore
                    const container = {
                        __typename: "FoodContainer",
                        id: randomString(24),
                        capacity: convertToFloat(amount),
                        amount: convertToFloat(amount),
                        datePurchased: new Date(),
                        expiryDate: expiryDate ? new Date(expiryDate) : null, 
                        dateOpened: null,
                        price: new Price(roundNumber(price.amount), price.currency)
                    } as FoodContainer;

                    db.foods[foodId].containers.push(container);
                    newFoodContainers.push(container);
                }
            });

            saveDatabase(db);
            return newFoodContainers;
        },
        editFood: (
            _: any, 
            { originalName, newData } : 
            { originalName: string, newData: Food}) => {
            const db = loadDatabase();
            db.foods = db.foods.map(food => {
                if (food.name !== originalName) return food;
                else return {
                    ...newData,
                    containers: food.containers // retain the containers as they should not be modified
                };
            });

            saveDatabase(db);
            return newData;
        },

        consumeFoods: (_: any, { consumeOrders }: {consumeOrders: ConsumeOrder[]}) => {
            const db = loadDatabase();
            let hasError = false;
            consumeOrders.forEach(order => {
                const { containerID, amount } = order;
                const foodId = db.foods.findIndex(
                    food => food.containers.find(con => con.id === containerID)
                );

                if (foodId < 0) {
                    hasError = true;
                    return;
                };
                const containerIndex = db.foods[foodId]
                    .containers
                    .findIndex(con => con.id === containerID);
                
                // check if container is okay to deduct
                const container = db.foods[foodId].containers[containerIndex] as FoodContainer;
                if (container.amount < amount) {
                    hasError = true;
                    return;
                }

                // apply the deduction
                db.foods[foodId].containers[containerIndex].amount -= amount;
                if (!db.foods[foodId].containers[containerIndex].dateOpened) {
                    db.foods[foodId].containers[containerIndex].dateOpened = new Date();
                }

                // check if the container needs to be disposed
                // you dispose a container if it is empty, or it has really really few food left.
                const {amount: remainingAmount, capacity} = db.foods[foodId].containers[containerIndex];
                if (remainingAmount / capacity < 0.01) {
                    db.foods[foodId].containers = db.foods[foodId].containers.filter((_, i) => i !== containerIndex);
                }
            });

            if (!hasError) {
                saveDatabase(db);
            }
            return hasError ? 
                consumeOrders.map(({containerID}) => containerID) 
                : null;
        }
    }
}
export default resolvers;
