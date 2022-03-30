import { render, screen, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/react-testing";
import userEvent from "@testing-library/user-event";
import { fakeItem, fakeUser, makePaginationMocksFor } from "../lib/testUtils";
import {
  CreateProduct,
  CREATE_PRODUCT_MUTATION,
} from "../components/CreateProduct";
import Router from "next/router"; // We will mock this
import { ALL_PRODUCTS_QUERY } from "../components/Products";
import wait from "waait";

jest.mock("next/router", () => ({
  push: jest.fn(),
}));

const MockedItem = fakeItem();

const mocks = [
  {
    request: {
      query: CREATE_PRODUCT_MUTATION,
      variables: {
        name: MockedItem.name,
        description: MockedItem.description,
        image: "",
        price: MockedItem.price,
      },
    },
    result: {
      data: {
        createProduct: {
          ...MockedItem,
          id: "mocked_item",
          __typename: "Item",
        },
      },
    },
  },
  {
    request: {
      query: ALL_PRODUCTS_QUERY,
      variables: { skip: 0, first: 2 },
    },
    result: {
      data: {
        allProducts: [MockedItem],
      },
    },
  },
];

describe("<CreateProduct />", () => {
  it("Renders and matches snapshot", () => {
    const { container } = render(
      <MockedProvider>
        <CreateProduct />
      </MockedProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it("Handles the updating", async () => {
    // 1. Render the form
    const { container } = render(
      <MockedProvider>
        <CreateProduct />
      </MockedProvider>
    );

    // 2. Type into the boxes
    await userEvent.type(screen.getByPlaceholderText(/name/i), MockedItem.name);
    await userEvent.type(
      screen.getByPlaceholderText(/price/i),
      MockedItem.price.toString()
    );
    await userEvent.type(
      screen.getByLabelText(/description/i),
      MockedItem.description
    );

    // 3. Check that the boxes are populated
    expect(screen.getByDisplayValue(MockedItem.name)).toBeInTheDocument();
    const price = screen.getByPlaceholderText(/price/i);
    expect(price).toHaveValue(MockedItem.price);
    expect(
      screen.getByDisplayValue(MockedItem.description)
    ).toBeInTheDocument();
  });

  it("Creates the item when the form is submitted", async () => {
    // 1. Render the form
    const { container, debug } = render(
      <MockedProvider mocks={mocks}>
        <CreateProduct />
      </MockedProvider>
    );

    // 2. Type into the boxes
    await userEvent.type(screen.getByPlaceholderText(/name/i), MockedItem.name);
    await userEvent.type(
      screen.getByPlaceholderText(/price/i),
      MockedItem.price.toString()
    );
    await userEvent.type(
      screen.getByLabelText(/description/i),
      MockedItem.description
    );

    // 3. Submit it and check that the page has changed
    await userEvent.click(screen.getByText(/add product/i));
    await waitFor(() => wait(0));
    expect(Router.push).toHaveBeenCalledWith({
      pathname: "/product/[id]",
      query: { id: "mocked_item" },
    });
  });
});
