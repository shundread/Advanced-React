import Link from "next/link";
import { formatMoney } from "../lib/formatMoney";
import { ItemStyles } from "./styles/ItemStyles";
import { PriceTag } from "./styles/PriceTag";
import { Title } from "./styles/Title";

export function Product({ product }) {
  return (
    <ItemStyles>
      <img src={product?.photo?.src} alt={product.name} />
      <Title>
        <Link href={`/product/${product.id}`}>{product.name}</Link>
      </Title>
      <PriceTag>{formatMoney(product.price)}</PriceTag>
    </ItemStyles>
  );
  // TODO: Add buttons to edit and delete item
}
