import React from "react";
import { Icon } from "@material-ui/core";
import { BuyRecord, ConsumeRecord } from "../../data/typedefs";
import moment from "moment";

const RecordItem = ({ record }: { record: BuyRecord | ConsumeRecord }) => {
  // compute attributes to render
  const isBuyOrder = "buyOrder" in record;
  const recordLogo = isBuyOrder ? "shopping_cart" : "whatshot";
  const foodName = isBuyOrder
    ? (record as BuyRecord).buyOrder.foodName
    : (record as ConsumeRecord).foodName;
  const price = isBuyOrder
    ? (record as BuyRecord).buyOrder.price
    : (record as ConsumeRecord).equivalentPrice;

  return (
    <div className="Record-Container">
      <div className="Record-SideContainer">
        <Icon style={{ fontSize: 36 }}>{recordLogo}</Icon>
      </div>
      <div className="Record-Inner">
        <div className="Record-Name">{foodName}</div>
        <div className="Record-Date">
          {moment(record.date).format("YYYY-MM-DD HH:mm")}{" "}
        </div>
      </div>
      <div
        className={`Record-SideContainer Record-Price-${
          isBuyOrder ? "Buy" : "Consume"
        }`}
      >
        {price.amount} {price.currency}
      </div>
    </div>
  );
};

export default RecordItem;
