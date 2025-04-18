import type { LostObject, FoundObject } from "./types";

// Using coordinates around the UCI campus area
const lostObjects: LostObject[] = [
  {
    type: "lost",
    personName: "Priyansh",
    itemId: "1",
    itemName: "Keys",
    itemDescription: "A set of keys",
    location: [33.647238, -117.842651],
    date: "2022-01-01",
    personID: "1",
    personEmail: "ok@gmail.com",
  },
  {
    type: "lost",
    itemId: "2",
    personName: "Priyansh",
    itemName: "Wallet",
    itemDescription: "A wallet",
    location: [33.643987, -117.839733],
    date: "2022-01-01",
    personID: "1",
    personEmail: "priyanshpokemon@gmail.com",
  },
  {
    type: "lost",
    itemId: "2",
    personName: "Priyansh",
    itemName: "Wallet",
    itemDescription: "A wallet",
    location: [33.643987, -117.839733],
    date: "2022-01-01",
    personID: "1",
    personEmail: "priyanshpokemon@gmail.com",
  },
  {
    type: "lost",
    itemId: "3",
    personName: "Priyansh",
    itemName: "Phone",
    itemDescription: "A phone",
    location: [33.645216, -117.844497],
    date: "2022-01-01",
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
    location: [33.641442, -117.841392],
    date: "2022-01-01",
    personID: "1",
    personEmail: "ok@gmail.com",
  },
  {
    type: "found",
    itemId: "5",
    personName: "Priyansh",
    itemName: "Wallet",
    itemDescription: "A wallet",
    location: [33.646112, -117.837108],
    date: "2022-01-01",
    personID: "1",
    personEmail: "sd",
  },
  {
    type: "found",
    itemId: "6",
    personName: "Priyansh",
    itemName: "Phone",
    itemDescription: "A phone",
    location: [33.639751, -117.839905],
    date: "2022-01-01",
    personID: "1",
    personEmail: "",
  },
];

export { lostObjects, foundObjects };
