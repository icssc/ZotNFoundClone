import type { LostObject, FoundObject } from "./types";

const lostObjects: LostObject[] = [
  {
    type: "lost",
    personName: "Priyansh",
    itemId: "1",
    itemName: "Keys",
    itemDescription: "A set of keys",
    location: [51.505, -0.09],
    date: "2022-01-01",
    isFound: false,
    personID: "1",
    personEmail: "ok@gmail.com",
  },
  {
    type: "lost",
    itemId: "2",
    personName: "Priyansh",
    itemName: "Wallet",
    itemDescription: "A wallet",
    location: [51.505, -0.09],
    date: "2022-01-01",
    isFound: false,
    personID: "1",
    personEmail: "priyanshpokemon@gmail.com",
  },
  {
    type: "lost",
    itemId: "3",
    personName: "Priyansh",
    itemName: "Phone",
    itemDescription: "A phone",
    location: [51.505, -0.09],
    date: "2022-01-01",
    isFound: false,
    personID: "1",
    personEmail: "",
  },
];

const foundObjects: FoundObject[] = [
  {
    type: "found",
    itemId: "4",
    personName: "Priyansh",
    itemName: "Keys",
    itemDescription: "A set of keys",
    location: [51.505, -0.09],
    date: "2022-01-01",
    isReturned: true,
    personID: "1",
    personEmail: "ok@gmail.com",
  },
  {
    type: "found",
    itemId: "5",
    personName: "Priyansh",
    itemName: "Wallet",
    itemDescription: "A wallet",
    location: [51.505, -0.09],
    date: "2022-01-01",
    isReturned: false,
    personID: "1",
    personEmail: "sd",
  },
  {
    type: "found",
    itemId: "6",
    personName: "Priyansh",
    itemName: "Phone",
    itemDescription: "A phone",
    location: [51.505, -0.09],
    date: "2022-01-01",
    isReturned: false,
    personID: "1",
    personEmail: "",
  },
];


export { lostObjects, foundObjects };
