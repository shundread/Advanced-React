import { integer, relationship, text, virtual } from "@keystone-next/fields";
import { list } from "@keystone-next/keystone/schema";
import formatMoney from "../lib/formatMoney";

export const Order = list({
  fields: {
    label: virtual({
      graphQLReturnType: "String",
      async resolver(item, args, context) {
        // XXX: Nice to look at the keystone UI but probably don't do this
        const user = await context.lists.User.findOne({
          where: { id: item.user.toString() },
          resolveFields: "email",
        });

        return `${user.email} - ${formatMoney(item.total)}`;
      },
    }),
    total: integer({ isRequired: true }),
    items: relationship({ ref: "OrderItem.order", many: true }),
    user: relationship({ ref: "User.orders" }),
    charge: text({ isRequired: true }),
  },
});
