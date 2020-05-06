import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import moment from 'moment';

import resolvers, {
    typeDefs,
    localStorageKey,
    initialDatabase
} from './resolvers';

beforeEach(() => {
    let store = { ...initialDatabase };
    spyOn(localStorage, 'getItem').and.callFake(function (key) {
        return key === localStorageKey ? store : undefined;
    });
    spyOn(localStorage, 'setItem').and.callFake(function (key, value) {
        return; // no set item please
    });
    spyOn(localStorage, 'clear').and.callFake(function () {
        return; // no clear items please
    });
});

// create a dummy component to make use of the query and mutation hooks from apollo
describe("Food creation and query", () => {
    /**
     * Common setup
     */
    const fakeFood = {
        name: "Fake food",
        unit: "unit",
        stockLevel: 10,
        __typename: "Food",
        containers: []
    };

    const fakeFoodInfo = {
        __typename: "FoodInfo",
        numberOfContainers: 0,
        expiredContainers: 0,
        openedContainers: 0,
        
        totalAmount: 0,
        totalWorth: 0,

        percentageLeft: 0,

        understock: true
    };

    const buyOrder = {
        foodName: fakeFood.name,
        price: {
            currency: "EUR",
            amount: 10,
        },
        expiryDate: moment(new Date()).add(10, 'days').toDate(),
        amount: 250
    };

    const consumeOrder = {
        amount: 100
    };

    const client = new ApolloClient({
        typeDefs,
        resolvers
    });

    /**
     * Food creation test
     */
    it("Should be able to create a food record", async () => {
        const MUTATION = gql`
        mutation addFoodMutation($name: String!, $unit: String!, $stockLevel: Number) {
            addFood(name : $name, unit: $unit, stockLevel: $stockLevel) @client
        }
        `;
        const { data } = await client.mutate({ 
            mutation: MUTATION, 
            variables: fakeFood
        });
        
        const db = JSON.parse(localStorage.getItem(localStorageKey) || "");
        
        // new record exists in db
        expect(db.foods[0]).toEqual(fakeFood);
        // new record returned
        expect(data).toEqual({ addFood: fakeFood });
    });

    /**
     * Food query test
     */
    it("Should be able to query a food record and its info", async () => {
        const QUERY = gql`
            query queryFood($foodName: String!) {
                foods @client {
                    name
                    unit
                    containers
                    stockLevel
                }
                food(name: $foodName) @client {
                    name
                    unit
                    stockLevel
                    containers
                    info {
                        numberOfContainers
                        expiredContainers
                        openedContainers
                        
                        totalAmount
                        totalWorth

                        percentageLeft

                        understock
                    }
                }
            }
        `;

        // launch query
        const { data } = await client.query({
            query: QUERY,
            variables: {
                foodName: fakeFood.name
            }
        });

        // expected query result
        expect(data).toEqual({
            foods: [ fakeFood ],
            food: {
                ...fakeFood,
                info: fakeFoodInfo
            }
        });
    });
    
    /**
     * Food purchase
     */
    it("Should be able to buy food", async () => {
        const BUY_MUTATION = gql`
            mutation buyFood($buyOrder: BuyOrder!) {
                buyFood(buyOrders: [$buyOrder]) @client {
                    capacity
                    price {
                        currency
                        amount
                    }
                    amount
                    datePurchased
                    expiryDate
                    dateOpened

                    opened
                    expired
                    percentageLeft
                }
            }
        `;
        
        const { data } = await client.mutate({
            mutation: BUY_MUTATION,
            variables: { buyOrder }
        });

        expect(data?.buyFood?.length).toBe(1);
        expect(data?.buyFood[0]).toMatchObject({
            expiryDate: buyOrder.expiryDate,
            amount: buyOrder.amount,
            price: buyOrder.price,

            capacity: buyOrder.amount,
            opened: false,
            expired: false,
            percentageLeft: 100
        });
    });

    /**
     * Check if buying record is inserted to the db automatically and correctly
     */
    it("Should have the buying record", async () => {
        const RECORD_QUERY = gql`
            query getRecords {
                records(type: "BuyRecord") @client {
                    id
                    date
                    buyOrder {
                        foodName
                        price
                        expiryDate
                        amount
                    }
                }
            }
        `;

        const { data } = await client.query({
            query: RECORD_QUERY
        });

        expect(data?.records?.length).toBe(1);
        expect(data?.records?.[0].buyOrder).toMatchObject({
            ...buyOrder,
            expiryDate: buyOrder.expiryDate.toISOString()
        });
    });

    it("Should be able to consume food", async () => {
        const CONSUME_FOOD = gql`
            mutation consumeFood($consumeOrders: [ConsumeOrder]!) {
                consumeFoods(consumeOrders: $consumeOrders) @client
            }
        `;

        const QUERY_FOOD = gql`
            query queryFood($foodName: String!) {
                food (name: $foodName) @client {
                    containers {
                        id
                        quantity
                        capacity
                    }
                }
            }
        `;

        const { data: foodRecord } = await client.query({
            query: QUERY_FOOD
        });

        const { data: consumeFoodResult } = await client.mutate({
            mutation: CONSUME_FOOD,
            variables: {
                consumeOrders: [
                    {
                        containerID: foodRecord?.food?.containers?.[0].id,
                        amount: 1
                    }
                ]
            }
        });

        const { data: foodRecordAfterConsume } = await client.query({
            query: QUERY_FOOD
        });

        expect(consumeFoodResult[0]).toBe(foodRecord?.food?.containers?.[0].id);

        const { quantity, capacity } = foodRecordAfterConsume.food.containers[0];
        expect(capacity - quantity).toBe(1);
    });

});



