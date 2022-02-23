import { text } from "@keystone-next/fields";
import { list } from "@keystone-next/keystone/schema";

export const ProductImage = list({
  fields: {
    path: text({ isRequired: true }),
    altText: text()
  }
});
