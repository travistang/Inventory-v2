import {
    convertToFloat, 
    randomString, 
    roundNumber, 
} from '../../utils';

import { 
    Food, FoodContainer, 
    Unit, Price,
    BuyOrder,
    ConsumeOrder,
    BuyRecord, ConsumeRecord
} from '../typedefs';

import {
    loadDatabase, saveDatabase
} from './db';

const Mutation = {
    Mutation: {
        addFood: (_: any, { name, unit, stockLevel } : { name: string, unit: Unit, stockLevel: number | null}) => {
            const db = loadDatabase();

            const newRecord = {
                __typename: "Food",
                name, unit,
                stockLevel: stockLevel === null ? undefined : stockLevel,
                containers: [],
            };
            db.foods.push(newRecord);

            saveDatabase(db);
            return newRecord;
        },

        buyFood: (_: any, { buyOrders } : {buyOrders: BuyOrder[]}) => {
            const db = loadDatabase();
            const newFoodContainers : FoodContainer[] = [];
            const newRecords: BuyRecord[] = [];

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
                // record the buy orders
                newRecords.push({
                    __typename: "BuyRecord",
                    id: randomString(24),
                    date: new Date(),
                    buyOrder: {
                        __typename: "BuyOrder",
                        ...buyOrder
                    }
                } as BuyRecord);
            });

            // append records
            db.records = [...db.records, ...newRecords];
 
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

            // update records' name
            // only applies to buy records because it contains the name of the food
            const newFoodName = newData.name;
            if ( originalName !== newFoodName) {
                db.records = db.records.map(record => {
                    // Buy order changes
                    if (record?.buyOrder.foodName === originalName) {
                        return {
                            ...record,
                            buyOrder: {
                                ...record.buyOrder,
                                foodName: newFoodName
                            }
                        }
                    } 
                    // Consume order changes
                    else if (record?.foodName === originalName) {
                        return {
                            ...record,
                            foodName: newFoodName
                        }
                    }
                    // this order isnt about the food being editing
                    else return record;
                })
            }
            saveDatabase(db);
            return newData;
        },

        consumeFoods: (_: any, { consumeOrders }: {consumeOrders: ConsumeOrder[]}) => {
            const db = loadDatabase();
            let hasError = false;
            const newConsumeRecords: ConsumeRecord[] = [];

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

                // Compute the equivalent price for storage
                const equivalentPrice = new Price(
                    container.price.amount / capacity * amount,
                    container.price.currency
                );
                // add records to the array
                newConsumeRecords.push({
                    __typename: "ConsumeRecord",
                    id: randomString(24),
                    date: new Date(),
                    consumeOrder: order,
                    foodName: db.foods[foodId].name,
                    equivalentPrice
                } as ConsumeRecord);
            });

            if (!hasError) {
                // append records here
                db.records = [...db.records, ...newConsumeRecords];
                saveDatabase(db);
            }
            return hasError ? 
                consumeOrders.map(({containerID}) => containerID) 
                : null;
        }
    }
};

export default Mutation;