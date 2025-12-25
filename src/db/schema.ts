import {
  pgTable,
  serial,
  varchar,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: varchar("description").notNull(),
  type: varchar("type").notNull(),
  location: varchar("location").array().notNull(),
  date: varchar("date").notNull(),
  itemDate: varchar("itemdate").notNull(),
  email: varchar("email").notNull(),
  image: varchar("image").notNull(),
  isLost: boolean("islost").notNull(),
  isResolved: boolean("isresolved").default(false).notNull(),
  isHelped: boolean("ishelped"),
  is_deleted: boolean("is_deleted").default(false),
  foundBy: varchar("foundby"),
});

export const leaderboard = pgTable("leaderboard", {
  email: varchar("email").primaryKey(),
  points: integer("points").notNull(),
});

export const searches = pgTable("searches", {
  keyword: varchar("keyword").primaryKey(),
  emails: varchar("emails").array().default([]).notNull(),
});

export const emailToNumber = pgTable("emailtonumber", {
  email: varchar({ length: 254 }).primaryKey().notNull(),
  phonenumber: varchar({ length: 15 }).notNull(),
});

// Types for TypeScript
export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;

export type Leaderboard = typeof leaderboard.$inferSelect;
export type NewLeaderboard = typeof leaderboard.$inferInsert;

export type Search = typeof searches.$inferSelect;
export type NewSearch = typeof searches.$inferInsert;
