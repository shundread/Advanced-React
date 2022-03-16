import "dotenv/config";
import { createAuth } from "@keystone-next/auth";
import { config, createSchema } from "@keystone-next/keystone/schema";
import {
  withItemData,
  statelessSessions,
} from "@keystone-next/keystone/session";

import { CartItem } from "./schemas/CartItem";
import { User } from "./schemas/User";
import { Order } from "./schemas/Order";
import { OrderItem } from "./schemas/OrderItem";
import { Product } from "./schemas/Product";
import { ProductImage } from "./schemas/ProductImage";
import { insertSeedData } from "./seed-data";
import { sendPasswordResetEmail } from "./lib/mail";
import { extendGraphqlSchema } from "./mutations";

const databaseURL =
  process.env.DATABASE_URL || "mongodb://localhost:27017/sick-fits-keystone";

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360,
  secret: process.env.COOKIE_SECRET,
};

const { withAuth } = createAuth({
  listKey: "User",
  identityField: "email",
  secretField: "password",
  initFirstItem: {
    fields: ["name", "email", "password"],
    // TODO: add initial roles
  },
  passwordResetLink: {
    async sendToken(args) {
      await sendPasswordResetEmail({
        resetToken: args.token,
        to: args.identity,
      });
    },
  },
});

export default withAuth(
  config({
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL],
        credentials: true,
      },
    },
    db: {
      adapter: "mongoose",
      url: databaseURL,
      async onConnect(keystone) {
        if (process.argv.includes("--seed-data")) {
          await insertSeedData(keystone);
        }
      },
    },
    extendGraphqlSchema,
    lists: createSchema({
      User,
      Product,
      ProductImage,
      CartItem,
      Order,
      OrderItem,
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
      User: `id`,
    }),
  })
);
