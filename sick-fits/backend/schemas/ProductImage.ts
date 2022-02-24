import { relationship, text } from "@keystone-next/fields";
import { list } from "@keystone-next/keystone/schema";

export const ProductImage = list({
  fields: {
    src: text({ isRequired: true }),
    altText: text(),
    product: relationship({ ref: 'Product.photo' }),
  },
  ui: {
    listView: {
      initialColumns: ["src", "altText", "product"]
    }
  }
});
