import { gql, useQuery } from "@apollo/client";

export const CURRENT_USER_QUERY = gql`
  query CURRENT_USER_QUERY {
    authenticatedItem {
      ... on User {
        id
        email
        name
        cart {
          id
          quantity
          product {
            id
            name
            price
            photo {
              src
              altText
            }
          }
        }
      }
    }
  }
`;

export function useUser() {
  const { data } = useQuery(CURRENT_USER_QUERY);

  return data?.authenticatedItem;
}
