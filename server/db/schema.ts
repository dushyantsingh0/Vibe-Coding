import { pgTable, serial, text, integer, timestamp, unique } from 'drizzle-orm/pg-core';

export const posts = pgTable('posts', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    excerpt: text('excerpt').notNull(),
    content: text('content').notNull(),
    authorId: text('author_id').notNull(),
    authorName: text('author_name').notNull(),
    authorPhoto: text('author_photo'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    likes: integer('likes').default(0).notNull(),
    dislikes: integer('dislikes').default(0).notNull(),
});

export const postVotes = pgTable('post_votes', {
    id: serial('id').primaryKey(),
    postId: integer('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull(),
    voteType: text('vote_type').notNull(), // 'like' or 'dislike'
    createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
    uniqueUserPost: unique().on(table.postId, table.userId),
}));

export const comments = pgTable('comments', {
    id: serial('id').primaryKey(),
    postId: integer('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull(),
    userName: text('user_name').notNull(),
    userPhoto: text('user_photo'),
    text: text('text').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
