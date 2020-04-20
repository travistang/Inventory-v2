export const RawUnit = {
    unit: "unit",
    g: "g",
    mL: "mL"
}

export const RawCurrency = {
    EUR: "EUR",
    USD: "USD",
    PLN: "PLN",
    HKD: "HKD",
}

export type Currency = keyof typeof RawCurrency;
export type Unit     = keyof typeof RawUnit;


export class Price {
    static toHKDRate = (currency: Currency) => {
        switch(currency) {
            case "EUR": return 8.6;
            case "USD": return 7.6;
            case "PLN": return 2;
            case "HKD": return 1;
        }
    };

    static DEFAULT_ZERO = new Price(0, "HKD");

    constructor(
        readonly amount: number,
        readonly currency: Currency
    ) {}

    public as(currency: Currency): Price {
        const amountInHKD = this.amount * Price.toHKDRate(this.currency);
        return new Price(amountInHKD / Price.toHKDRate(currency), currency);
    }

    public add(price: Price): Price {
        const otherPriceInThisCurrency = price.as(this.currency);
        return new Price(otherPriceInThisCurrency.amount + this.amount, this.currency);
    }
}

export interface FoodContainer {
    id: string,
    capacity: number,
    amount: number,
    datePurchased: Date
    expiryDate?: Date,
    dateOpened?: Date,
    price: Price,

}

export interface FoodInfo {
    totalAmount: number,
    percentageLeft: number
}

export interface Food {
    stockLevel?: number,
    unit: Unit,
    name: string,
    containers: FoodContainer[],
}

export interface BuyOrder {
    foodName: string,
    price: Price,
    expiryDate?: Date,
    amount: number
};

export interface ConsumeOrder {
    containerID: string,
    amount: number
}
export interface Record {
    id: string,
    date: Date
}

export interface BuyRecord extends Record {
    buyOrder: BuyOrder
}

export interface ConsumeRecord extends Record {
    consumeOrder: ConsumeOrder,
    foodName: string,
    equivalentPrice: Price
}

export const typeDefs = `
    enum Currency {
        HKD
        USD
        EUR
        PLN
    }

    enum Unit {
        mL
        g
        unit
    }

    interface Record {
        id: ID!
        date: Date!
    }
    
    type BuyRecord implements Record {
        id: ID!
        date: Date!
        buyOrder: BuyOrder!
    }
    
    type ConsumeRecord implements Record {
        id: ID!
        date: Date!
        consumeOrder: ConsumeOrder!
        foodName: String!
        equivalentPrice: Price!
    }
    
    type Price {
        currency: Currency!
        amount: Number!
    }

    type FoodContainerInfo {
        expired: Boolean!
    }

    type FoodContainer {
        id: ID!
        capacity: Number!
        amount: Number!
        datePurchased: Date!
        expiryDate: Date
        dateOpened: Date
        price: Price!

        opened: Boolean!
        expired: Boolean!
        percentageLeft: Number!
    }

    type FoodInfo {
        numberOfContainers: Number!
        expiredContainers: Number!
        openedContainers: Number!
        
        totalAmount: Number!
        totalWorth: Number!

        percentageLeft: Number!

        understock: Boolean!
    }

    type Food {
        stockLevel: Number,
        name: String!
        unit: Unit!,
        containers: [FoodContainer!]!
        info: FoodInfo
    }
    
    type BuyOrder {
        foodName: String!
        price: Price!
        expiryDate: Date
        amount: Number!
    }

    type ConsumeOrder {
        containerID: ID!
        amount: Number!
    }

    type Query {
        food(name: String!): Food
        foods: [Food]!
        records(type: String!): [BuyRecord | ConsumeRecord]!
    }

    type Mutation {
        addFood(name: String!, unit: Unit!, stockLevel: Number): Food
        buyFood(buyOrders: [BuyOrder]!): [FoodContainer]
        editFood(originalName: String!, newData: Food!): Food
        consumeFoods(consumeOrders: [ConsumeOrder]!): [ID!]
    }
`;