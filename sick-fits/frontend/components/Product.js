import Link from "next/link";
import { formatMoney } from "../lib/formatMoney";
import { AddToCart } from "./AddToCart";
import { DeleteProduct } from "./DeleteProduct";
import { RenderIfSignedIn } from "./RenderIfSignedIn";
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
      <RenderIfSignedIn>
        <div className="buttonList">
          <Link
            href={{
              pathname: "/update",
              query: {
                id: product.id,
              },
            }}
          >
            ✏️ Edit
          </Link>
          <AddToCart id={product.id} />
          <DeleteProduct id={product.id}>✖️ Delete</DeleteProduct>
        </div>
      </RenderIfSignedIn>
    </ItemStyles>
  );
}
