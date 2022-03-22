import { integer, relationship, text, virtual } from "@keystone-next/fields";
import { list } from "@keystone-next/keystone/schema";
import { isSignedIn, rules } from "../access";
import formatMoney from "../lib/formatMoney";

// XXX: tbh I'd also add a timestamp if keystone doesn't provide it out of the box

export const Order = list({
  access: {
    create: isSignedIn,
    read: rules.canOrder,
    update: () => false,
    delete: () => false,
  },
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
