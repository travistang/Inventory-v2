import React from "react";
import { BuyRecord, ConsumeRecord, Price } from "../../data/typedefs";
import { AnimatedDrop } from "../../animations";
import Metric, { MetricProps } from "../../components/Metric";

const RecordsSummary = ({
  buyRecords = [],
  consumeRecords = [],
}: {
  buyRecords?: Array<BuyRecord>;
  consumeRecords?: Array<ConsumeRecord>;
}) => {
  // variables to be displayed
  const totalNumRecords = buyRecords.length + consumeRecords.length;
  const totalBuyPrice = buyRecords.reduce(
    (
      totalPrice,
      {
        buyOrder: {
          price: { amount, currency },
        },
      }
    ) => totalPrice.add(new Price(amount, currency)),
    new Price(0, "EUR")
  );
  const totalConsumePrice = consumeRecords.reduce(
    (totalPrice, { equivalentPrice: { amount, currency } }) =>
      totalPrice.add(new Price(amount, currency)),
    new Price(0, "EUR")
  );

  const RecordCell = (props: MetricProps) => <Metric {...props} className="RecordSummary-Cell" />;

  const metadata = [
    {
      iconName: "history",
      value: totalNumRecords,
      name: "Records",
    },
    {
      iconName: "shopping_cart",
      value: `${totalBuyPrice.amount.toFixed(2)} ${totalBuyPrice.currency}`,
      name: "Buy",
    },
    {
      iconName: "whatshot",
      value: `${totalConsumePrice.amount.toFixed(2)} ${
        totalConsumePrice.currency
      }`,
      name: "Consume",
    },
  ] as MetricProps[];

  return (
    <AnimatedDrop>
      <div className="RecordSummary-Container">
        {metadata.map((data) => (
          <RecordCell {...data} />
        ))}
      </div>
    </AnimatedDrop>
  );
};

export default RecordsSummary;
