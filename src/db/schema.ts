import {
  pgTable,
  serial,
  varchar,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
// import { PgArray } from "drizzle-orm/pg-core";

export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  name: varchar("name"),
  description: varchar("description"),
  type: varchar("type"),
  location: varchar("location").array(),
  date: varchar("date"),
  itemdate: varchar("itemdate"),
  email: varchar("email"),
  image: varchar("image"),
  islost: boolean("islost"),
  isresolved: boolean("isresolved"),
  ishelped: boolean("ishelped"),
  is_deleted: boolean("is_deleted").default(false),
});

export const leaderboard = pgTable("leaderboard", {
  email: varchar("email").primaryKey(),
  points: integer("points"),
});

export const searches = pgTable("searches", {
  keyword: varchar("keyword").primaryKey(),
  emails: varchar("emails").array(),
});

// Types for TypeScript
export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;

export type Leaderboard = typeof leaderboard.$inferSelect;
export type NewLeaderboard = typeof leaderboard.$inferInsert;

export type Search = typeof searches.$inferSelect;
export type NewSearch = typeof searches.$inferInsert;
