import "dotenv/config";
import { config, createSchema } from "@keystone-next/keystone/schema";

import { User } from "./schemas/User";

const databaseURL = process.env.DATABASE_URL || "mongodb://localhost:27017/sick-fits-keystone";

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360,
  secret: process.env.COOKIE_SECRET,
}

export default config({
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
    User
    // Schema items go in here
  }),
  ui: {
    // TODO: change this for roles
    isAccessAllowed: () => true,
  },
  // TODO: Add session values here
});
