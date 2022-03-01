import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import Head from "next/head";
import Link from "next/link";
import { perPage } from "../config";
import { ErrorMessage } from "./ErrorMessage";
import { PaginationStyles } from "./styles/PaginationStyles";

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    _allProductsMeta {
      count
    }
  }
`;

export function Pagination({ page }) {
  const { data, error, loading } = useQuery(PAGINATION_QUERY);
  if (loading) return <p>Loading</p>;
  if (error) return <ErrorMessage error={error} />;

  const itemCount = data._allProductsMeta.count;
  const pageCount = Math.ceil(itemCount / perPage);

  return (
    <PaginationStyles>
      <Head>
        <title>
          Sick fits - Page {page} of {pageCount}
        </title>
      </Head>
      <Link
        passHref
        href={{
          pathname: "/products/[page]",
          query: {
            page: page - 1,
          },
        }}
      >
        <a aria-disabled={page <= 1}>⬅️ Prev</a>
      </Link>
      <p>
        Page {page} of {pageCount}
      </p>
      <p>{itemCount} Items Total</p>
      <Link
        href={{
          pathname: "/products/[page]",
          query: {
            page: page + 1,
          },
        }}
      >
        <a aria-disabled={page >= pageCount}>➡️ Next</a>
      </Link>
    </PaginationStyles>
  );
}
