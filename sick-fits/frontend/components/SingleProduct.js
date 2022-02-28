import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { ErrorMessage } from "./ErrorMessage";
import Head from "next/head";
import styled from "styled-components";

export const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    Product(where: { id: $id }) {
      id
      description
      photo {
        src
        altText
      }
      name
      price
    }
  }
`;

const ProductStyles = styled.div`
  align-items: top;
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  grid-gap: 2rem;
  max-width: var(--maxWidth);
  img {
    width: 100%;
    object-fit: contain;
  }
`;

export function SingleProduct({ id }) {
  const { data, loading, error } = useQuery(SINGLE_ITEM_QUERY, {
    variables: { id },
  });

  if (loading) return <p>Loading</p>;
  if (error) return <ErrorMessage error={error} />;

  const { Product } = data;

  return (
    <ProductStyles>
      <Head>
        <title>Sick Fits | {Product.name}</title>
      </Head>
      <img src={Product.photo.src} alt={Product.photo.altText} />
      <div className="details">
        <h2>{Product.name}</h2>
        <p>{Product.description}</p>
      </div>
    </ProductStyles>
  );
}
