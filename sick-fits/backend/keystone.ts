import "dotenv/config";
import { createAuth } from "@keystone-next/auth";
import { config, createSchema } from "@keystone-next/keystone/schema";
import { withItemData, statelessSessions } from "@keystone-next/keystone/session";

import { User } from "./schemas/User";
import { Product } from "./schemas/Product";

const databaseURL = process.env.DATABASE_URL || "mongodb://localhost:27017/sick-fits-keystone";

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360,
  secret: process.env.COOKIE_SECRET,
}

const { withAuth } = createAuth({
  listKey: "User",
  identityField: "email",
  secretField: "password",
  initFirstItem: {
    fields: ["name", "email", "password"],
    // TODO: add initial roles
  }
});

export default withAuth(config({
  server: {
    cors: {
      origin: [process.env.FRONTEND_URL],
      credentials: true,
    },
  },
  db: {
    adapter: "mongoose",
    url: databaseURL,
    // TODO: Add data seeding here
  },
  lists: createSchema({
    User,
    Product
    // Schema items go in here
  }),
  ui: {
    // Show the UI only for people that pass this test
    isAccessAllowed: ({ session }) => {
      console.log(session);
      return Boolean(session?.data);
    },
  },
  session: withItemData(statelessSessions(sessionConfig), {
    // GraphQL query
    User: `id`
  })
}));
