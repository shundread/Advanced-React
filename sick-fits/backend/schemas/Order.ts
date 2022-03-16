import { integer, relationship, text, virtual } from "@keystone-next/fields";
import { list } from "@keystone-next/keystone/schema";
import formatMoney from "../lib/formatMoney";

export const Order = list({
  // TODO: Access
  fields: {
    label: virtual({
      graphQLReturnType: "String",
      resolver: function (entry) {
        return `${entry.user.email} - ${formatMoney(entry.total)}`;
      },
    }),
    total: integer({ isRequired: true }),
    items: relationship({ ref: "OrderItem.order", many: true }),
    user: relationship({ ref: "User.orders" }),
    charge: text(),
  },
});
