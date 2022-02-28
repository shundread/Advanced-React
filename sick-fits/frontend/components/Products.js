import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import styled from "styled-components";
import { ErrorMessage } from "./ErrorMessage";
import { LoadingDisplay } from "./LoadingDisplay";
import { Product } from "./Product";

export const ALL_PRODUCTS_QUERY = gql`
  query ALL_PRODUCTS_QUERY {
    allProducts {
      id
      name
      price
      description
      photo {
        id
        src
        altText
      }
    }
  }
`;

const ProductsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
`;

export function Products() {
  const { data, error, loading } = useQuery(ALL_PRODUCTS_QUERY);

  if (loading) return <LoadingDisplay />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <ProductsList>
        {data.allProducts.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </ProductsList>
    </div>
  );
}
