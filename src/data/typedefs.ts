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

export interface FoodContainerInfo {
    expired: boolean
}

export interface FoodContainer {
    id: string,
    unit: string,
    capacity: number,
    amount: number,
    dataPurchased: Date
    expiryDate?: Date,
    price: Price,
    dateOpened: Date | null,

    info: FoodContainerInfo
}

export interface FoodInfo {
    totalAmount: number,
    percentageLeft: number
}

export interface Food {
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


    type Price {
        currency: Currency!
        amount: Number!
    }

    type FoodContainerInfo {
        expired: Boolean!
    }

    type FoodContainer {
        id: ID!
        unit: String!
        capacity: Number!
        amount: Number!
        datePurchased: Date!
        expiryDate: Date
        dateOpened: Date
        price: Price!
    }

    type FoodInfo {
        numberOfContainers: Number!
        totalAmount: Number!
        percentageLeft: Number!
    }

    type Food {
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

    type Query {
        food(name: String!): Food
        foods: [Food]!
    }

    type Mutation {
        addFood(name: String!, unit: Unit!): Food
        buyFood(buyOrders: [BuyOrder]!): [FoodContainer]
    }
`;