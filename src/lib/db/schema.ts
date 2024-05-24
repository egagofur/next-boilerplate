import { relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

const updatedAndCreatedAt = {
  updatedAt: timestamp("updatd_at").$defaultFn(() => new Date()),
  createdAt: timestamp("created_at").notNull().defaultNow(),
};

export const articleStatusEnum = pgEnum("article_status_enum", [
  "draft",
  "published",
]);

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: varchar("name").notNull(),
  ...updatedAndCreatedAt,
});

export const articles = pgTable("articles", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  status: articleStatusEnum("status").notNull().default("draft"),
  ...updatedAndCreatedAt,
});

export const tags = pgTable("tags", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: varchar("name").notNull(),
  ...updatedAndCreatedAt,
});

export const articleOnTags = pgTable(
  "article_tags",
  {
    articleId: uuid("article_id")
      .notNull()
      .references(() => articles.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    ...updatedAndCreatedAt,
  },
  (t) => ({
    pk: primaryKey(t.articleId, t.tagId),
  })
);

export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  articleId: uuid("article_id")
    .notNull()
    .references(() => articles.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  content: text("content").notNull(),
  ...updatedAndCreatedAt,
});

export const articleRelations = relations(articles, ({ one, many }) => ({
  comments: one(comments, {
    fields: [articles.id],
    references: [comments.articleId],
  }),
  categories: one(categories, {
    fields: [articles.categoryId],
    references: [categories.id],
  }),

  articleTags: many(articleOnTags),
}));

export const categoryRelations = relations(categories, ({ many }) => ({
  articles: many(articles),
}));

export const tagRelations = relations(tags, ({ many }) => ({
  articles: many(articleOnTags),
}));

export const artileOnTagRelations = relations(articleOnTags, ({ one }) => ({
  article: one(articles, {
    fields: [articleOnTags.articleId],
    references: [articles.id],
  }),
  tag: one(tags, {
    fields: [articleOnTags.tagId],
    references: [tags.id],
  }),
}));

export type TCategory = typeof categories.$inferSelect;
export type TArticle = typeof articles.$inferSelect;
export type TComment = typeof comments.$inferSelect;
export type TTag = typeof tags.$inferSelect;
export type TArticleOnTag = typeof articleOnTags.$inferSelect;
