import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  json,
} from "drizzle-orm/pg-core";
import { v4 as uuid } from "uuid";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  projects: jsonb("projects").notNull().default([]),
  teams: jsonb("teams").notNull().default([]),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});

export const teams = pgTable("teams", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuid()),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  owner: text("owner")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  members: jsonb("members").notNull().default([]),
  admins: jsonb("admins").notNull().default([]),
  guests: jsonb("guests").notNull().default([]),
  projects: jsonb("projects").notNull().default([]),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});

export const projects = pgTable("projects", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuid()),
  name: text("name").notNull(),
  owner: text("owner")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  team_id: text("team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  variables: jsonb("variables").notNull().default([]),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});

export const teamInvites = pgTable("team_invites", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuid()),
  team_id: text("team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  invited_by: text("invited_by")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: text("role").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});
