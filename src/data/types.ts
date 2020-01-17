import  { dayToMs, msToDay } from '../utils';
import md5 from 'blueimp-md5';

export class Recordable {
    readonly id: string;

    constructor() {
        this.id = md5(
            new Date().getTime().toString() + 
            Math.random().toString()
        );
    }

    isEqual(other: Recordable): boolean {
        return other.id === this.id;
    }

}

export class Location extends Recordable {
    constructor(
        public lat: number,
        public lng: number,
        public name?: string
    ) {
        super();
    }

}

export type ConsumptionRecord = {
    itemID: string,
    quantity: number,
    date: Date,
}

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

export class FoodContainer extends Recordable {
    consumptionRecords: Array<ConsumptionRecord> = [];
    quantity: number;

    constructor(
        readonly price:  Price,
        // the max quantity it can hold
        readonly capacity: number,
        // expiry date.
        readonly expiryDate?: Date,
        // the date it is bought.
        readonly datePurchased: Date = new Date(),
    ) {
        super();
        if(this.capacity <= 0) { 
            throw new Error("Invalid configuration for food container.");
        }
        this.quantity = capacity;
    }

    public isEmpty(): boolean {
        return this.quantity <= 0;
    }

    public isExpired(): boolean {
        return !!this.expiryDate && new Date().getTime() > this.expiryDate.getTime();
    }

    public dateOpened(): Date | null {
        const firstConsumption = this.consumptionRecords.sort(
            (ra, rb) => ra.date.getTime() - rb.date.getTime()
        ).pop();

        if(!firstConsumption) return null;
        return firstConsumption.date;
    }

    public worth(inCurrency: Currency): Price {
        return new Price(
            this.price.amount * this.quantity / this.capacity, 
            this.price.currency
        ).as(inCurrency);
    }

    public consume(quantity: number, date = new Date()): ConsumptionRecord {
        if (quantity > this.quantity) throw new Error("You cannot consume more food than there is in the container.");
        
        this.quantity -= quantity;
        const record = { date, quantity, itemID: this.id } as ConsumptionRecord;
        this.consumptionRecords.push(record);
        return record;
    }

    public shouldConsumeUrgently(latestTimeToConsumeAfterFirstOpen: number | null): boolean {
        /*
            Few cases that should mark the food inside this container as should be consumed urgently:
            - When it is expired and there are food inside
            - When it is opened and the time you should consume it by latest has passed more than 70%
            - When there are more than half left and today is closer to the the expiry date than the date of purchase
        */
        if (this.isExpired() && !this.isEmpty()) return true;

        const now = new Date().getTime();
        const dateOpened = this.dateOpened();
        if(
            !!latestTimeToConsumeAfterFirstOpen && !!dateOpened 
            && now - dateOpened.getTime() < latestTimeToConsumeAfterFirstOpen * 0.7) {
                return true;
        }
        
        if(!this.expiryDate || !dateOpened) return false;

        const percentageConsumed = this.quantity / this.capacity * 100;
        if (percentageConsumed < 50 && 
            (now - this.expiryDate.getTime()) < (now - dateOpened.getTime())
        ) { return true }

        return false;
    }
}

export class Food extends Recordable {
    containers: Array<FoodContainer> = [];
    // days to consume, in ms
    latestTimeToConsumeAfterFirstOpen: number | null;
    constructor(
        public name: string,
        public unit: Unit,
        // days to consume, in days
        latestDayToConsumeAfterFirstOpen: number | null = null
    ) {
        super();
        this.latestTimeToConsumeAfterFirstOpen = latestDayToConsumeAfterFirstOpen? 
            dayToMs(latestDayToConsumeAfterFirstOpen)
            : null;
    }

    public latestOpenDays(): number | null {
        return msToDay(this.latestTimeToConsumeAfterFirstOpen);
    }

    public updateInfo(
        name: string, unit: Unit, timeFirstOpen: number | null
    ) {
        this.name = name;
        this.unit = unit;
        this.latestTimeToConsumeAfterFirstOpen = dayToMs(timeFirstOpen);
    }

    public buy(quantity: number, price: Price, expiryDate?: Date): FoodContainer {
        const newContainer = new FoodContainer(
            price,
            quantity,
            expiryDate,
            new Date()
        );

        this.containers.push(newContainer);
        return newContainer;
    }

    public getAllConsumptionRecords(): Array<ConsumptionRecord> {
        return this.containers.reduce((records : Array<ConsumptionRecord>, container) => [
            ...records, ...container.consumptionRecords
        ], []).sort(
            // order by date
            (recA, recB) => recA.date.getTime() - recB.date.getTime()
        );
    }

    public dispose(containerID: string) {
        this.containers = this.containers.filter(con => con.id !== containerID);
    }

    public totalAmount(): number {
        return this.containers.reduce((sum, con) => sum + con.quantity, 0);
    }

    // TODO: total amount of history also depends on buying...
    public getTotalAmountHistory(): Array<number> {
        const consumptionRecords = this.getAllConsumptionRecords();
        
        type PurchaseType = { quantity: number, date: Date};
        const purchaseRecords: Array<PurchaseType> = this.containers.map(
            ({ capacity, datePurchased}) => ({
                quantity: -capacity, // because before the purchase the quantity is fewer than before
                date: datePurchased
            })
        );
        
        if (consumptionRecords.length === 0) return [0, 0];
        // a temporary type to help reducing the records
        type RecordType = PurchaseType | ConsumptionRecord;
        const allRecords: Array<RecordType> = (consumptionRecords as Array<RecordType>)
            .concat(purchaseRecords)
            .sort((recA, recB) => recA.date.getTime() - recB.date.getTime());
        
            type ReduceType = { cumsum: number, data: Array<number>};
        return allRecords.reduceRight(
            ({cumsum, data}: ReduceType, rec) => {
                const newAmount = cumsum + rec.quantity;
                return { cumsum: newAmount, data: [newAmount, ...data]}
            },
            // initially the amount is  
            {cumsum: this.totalAmount(), data: [this.totalAmount()]} as ReduceType
        ).data;
    }

    public remainingFoodPercentage(): number {
        const totalCapacity = this.containers.reduce((sum, con) => sum + con.capacity, 0);
        if (totalCapacity === 0) return 0;
        return this.totalAmount() / totalCapacity * 100;
    }
    

    public hasContainerInUrgentConsumptionState(): boolean {
        return this.containers.some(
            con => con.shouldConsumeUrgently(this.latestTimeToConsumeAfterFirstOpen)
        );
    }

    public totalWorth(inCurrency: Currency): Price {
        return this.containers.reduce((total, con) => total.add(con.worth(inCurrency)), new Price(0, inCurrency)); 
    }
}

export class BuyOrder extends Recordable {
    foodContainers: Array<FoodContainer> = [];
    
    totalAmount(inCurrency: Currency = "EUR") {
        return this.foodContainers.reduce((total, con) => total.add(con.price), new Price(0, inCurrency));
    }
}
/*
    Container as bags. Such as backpacks, lockers. For reusable and long-lasting items.
*/

export class Container extends Recordable {
    constructor(
        public location: Location,
        public name:     string, 
    ) {
        super();
    }
}
