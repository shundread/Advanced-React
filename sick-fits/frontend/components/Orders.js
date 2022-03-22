import Link from "next/link";
import styled from "styled-components";
import gql from "graphql-tag";

import { useQuery } from "@apollo/client";

import { ErrorMessage } from "../components/ErrorMessage";
import { OrderItemStyles } from "../components/styles/OrderItemStyles";
import { formatMoney } from "../lib/formatMoney";

const USER_ORDERS_QUERY = gql`
  query USER_ORDERS_QUERY {
    allOrders {
      id
      charge
      total
      user {
        id
      }
      items {
        id
        name
        description
        quantity
        price
        photo {
          id
          src
          altText
        }
      }
    }
  }
`;

const OrderList = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  grid-gap: 4rem;
`;

export function Orders() {
  const { data, error, loading } = useQuery(USER_ORDERS_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <ErrorMessage error={error} />;

  const { allOrders } = data;

  return (
    <>
      <h2>Your orders ({allOrders.length})</h2>
      <OrderList>
        {allOrders.map((order) => (
          <OrderItemStyles key={order.id}>
            <Link
              href={{
                pathname: "/order",
                query: { id: order.id },
              }}
              passHref
            >
              <a>
                <div className="order-meta">
                  <p>{countItems(order)} items</p>
                  <p>{order.items.length} product(s)</p>
                  <p>{formatMoney(order.total)}</p>
                </div>
                <div className="images">
                  {order.items.map((item) => (
                    <img
                      key={item.id}
                      src={item.photo?.src}
                      alt={item.photo?.altText}
                    />
                  ))}
                </div>
              </a>
            </Link>
          </OrderItemStyles>
        ))}
      </OrderList>
    </>
  );
}

function countItems(order) {
  return order.items.reduce((tally, item) => tally + item.quantity, 0);
}
