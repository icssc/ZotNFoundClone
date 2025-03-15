"use client";
import { checkReturned, isLostObject, Object } from "@/lib/types";
import React, { memo } from "react";
import { foundObjects, lostObjects } from "@/lib/fakeData";

// memoize component which filters data (we do down the line) https://react.dev/reference/react/useMemo
const ItemDisplayList = memo(function ItemDisplayList() {
  const items: Object[] = (foundObjects as Object[]).concat(
    lostObjects as Object[]
  );

  // * Causes key error with duplicate keys
  const moreitems: Object[] = [
    ...items,
    ...items,
    ...items,
    ...items,
    ...items,
    ...items,
  ];

  return (
    <div className="flex h-full overflow-y-scroll flex-col p-4 space-y-4">
      {moreitems.map((item: Object) => (
        <Item key={item.itemId} {...item} />
      ))}
    </div>
  );
});

export default ItemDisplayList;

function Item(prop: Object) {
  const islostObject = isLostObject(prop);
  const isreturnedObject = checkReturned(prop);
  return (
    <div className="flex flex-col p-4 border-b border-gray-200">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center space-x-2">
          <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          <div>
            <p className="font-semibold">{prop.itemName}</p>
            <p className="text-sm text-gray-500">
              {islostObject ? "Lost" : "Found"} by {prop.personName}
            </p>
            <p>{isreturnedObject ? "Returned" : "Not Returned"}</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500">{prop.date}</p>
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-500">{prop.itemDescription}</p>
      </div>
    </div>
  );
}
