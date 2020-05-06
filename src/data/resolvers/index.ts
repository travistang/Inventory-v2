import { 
    Food, FoodContainer, Price, Record
} from '../typedefs';
import { 
    isTimeInPast 
} from '../../utils';
import Mutations from './mutations';
import Queries from './queries';
import { loadDatabase } from './db';


export * from './db';

const resolvers = {
    ...Queries,
    Price: {
        __typename: (_ : Price) => "Price" 
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
        info: async (food: Food) => {
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

            // getthe food history...
            const db = await loadDatabase();
            // sort the relevant records in decreasing order
            const foodRecords = db.records.filter(record => (
                // case for a buy record
                record.buyOrder?.foodName === food.name || 
                // case fo r a consume record
                record.foodName === food.name
            )).sort((r1 : Record, r2 : Record) => r2.date.getTime() - r1.date.getTime());
            
            // compute reverse records according to the total amount
            const recordHistory = foodRecords.reduce((history, record) => {
                const {amount : lastAmount} = history[0];
                const isBuyOrder            = 'buyOrder' in record;
                const absAmountDiff         = (record?.buyOrder.amount || record?.consumeOrder.amount) || 0;
                const previousAmount        = lastAmount + (isBuyOrder ? -absAmountDiff : absAmountDiff);

                return [
                    { amount : previousAmount, date: record.date },
                    ...history
                ];
            }, [{ amount: totalAmount, date: new Date() }]);

            return {
                __typename: "FoodInfo",
                amountRecords: recordHistory,
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
    ...Mutations,
}

export default resolvers;
