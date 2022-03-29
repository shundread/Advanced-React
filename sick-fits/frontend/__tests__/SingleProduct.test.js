import { MockedProvider } from "@apollo/react-testing";
import { render, screen } from "@testing-library/react";
import { SingleProduct, SINGLE_ITEM_QUERY } from "../components/SingleProduct";
import { fakeItem } from "../lib/testUtils";

const Product = fakeItem();

const SuccessMocks = [
  {
    // When someone requests this query and variable combo
    request: {
      query: SINGLE_ITEM_QUERY,
      variables: {
        id: "abc123",
      },
    },
    // Return this data
    result: {
      data: {
        Product,
      },
    },
  },
];

const ErrorMocks = [
  {
    // When someone requests this query and variable combo
    request: {
      query: SINGLE_ITEM_QUERY,
      variables: {
        id: "abc123",
      },
    },
    // Return this data
    result: {
      errors: [{ message: "Item not found" }],
    },
  },
];

describe("<SingleProduct />", () => {
  it("Renders with proper data", async () => {
    const { container } = render(
      <MockedProvider mocks={SuccessMocks}>
        <SingleProduct id="abc123" />
      </MockedProvider>
    );
    await screen.findByTestId("single-product");

    expect(container).toMatchSnapshot();
  });

  it("Errors out when an item is not found", async () => {
    const { container } = render(
      <MockedProvider mocks={ErrorMocks}>
        <SingleProduct id="abc123" />
      </MockedProvider>
    );
    await screen.findByTestId("graphql-error");
    expect(container).toHaveTextContent("Shoot");
    expect(container).toHaveTextContent("Item not found");
  });
});
