import { integer, relationship, text } from "@keystone-next/fields";
import { list } from "@keystone-next/keystone/schema";
import { isSignedIn, rules } from "../access";

export const OrderItem = list({
  access: {
    create: isSignedIn,
    read: rules.canManageOrderItems,
    update: () => false,
    delete: () => false,
  },
  fields: {
    name: text({ isRequired: true }),
    description: text({
      ui: { displayMode: "textarea" },
    }),
    photo: relationship({
      ref: "ProductImage",
      ui: {
        displayMode: "cards",
        cardFields: ["src", "altText"],
        inlineCreate: { fields: ["src", "altText"] },
        inlineEdit: { fields: ["src", "altText"] },
      },
    }),
    price: integer({ isRequired: true }),
    quantity: integer({ isRequired: true }),
    order: relationship({ ref: "Order.items" }),
  },
});
