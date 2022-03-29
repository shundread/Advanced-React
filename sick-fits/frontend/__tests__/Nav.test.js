import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/react-testing";
import { Nav } from "../components/Nav";
import { CURRENT_USER_QUERY } from "../lib/useUser";
import { expectLink, fakeCartItem, fakeUser } from "../lib/testUtils";
import { CartStateProvider } from "../lib/cartState";

// Make some mocks for being logged out, logged in and logged in with cart items

const NotSignedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { authenticatedItem: null } },
  },
];

const SignedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { authenticatedItem: fakeUser() } },
  },
];

const SignedInWithCartItemsMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        authenticatedItem: fakeUser({
          cart: [fakeCartItem()],
        }),
      },
    },
  },
];

describe("<Nav />", () => {
  it("Renders a minimal nav when signed out", () => {
    const { container } = render(
      <CartStateProvider>
        <MockedProvider mocks={NotSignedInMocks}>
          <Nav />
        </MockedProvider>
      </CartStateProvider>
    );

    // Use utility function to check for presence of Sign In and Products
    expectLink({ container, text: "Sign In", url: "/signin" });
    expectLink({ container, text: "Products", url: "/products" });

    // Check that links and options for people who are logged in are not here
    expect(container).not.toHaveTextContent("Sell");
    expect(container).not.toHaveTextContent("Orders");
    expect(container).not.toHaveTextContent("Account");
    expect(container).not.toHaveTextContent("My cart");

    expect(container).toMatchSnapshot();
  });

  it("Renders a full navigation when signed in", async () => {
    const { container, debug } = render(
      <CartStateProvider>
        <MockedProvider mocks={SignedInMocks}>
          <Nav />
        </MockedProvider>
      </CartStateProvider>
    );

    // Wait for redraw since there's an initial not-logged-in render
    await screen.findByText("Account");

    // Check that all links for people who are logged in are there
    expectLink({ container, text: "Products", url: "/products" });
    expectLink({ container, text: "Sell", url: "/sell" });
    expectLink({ container, text: "Orders", url: "/orders" });
    expectLink({ container, text: "Account", url: "/account" });

    // My cart is not a link so just look for the text
    expect(container).toHaveTextContent("My cart");

    // Check that links and options for people who are logged out are not here
    expect(container).not.toHaveTextContent("Sign In");

    expect(container).toMatchSnapshot();
  });

  it("Renders the amount of items in the cart", async () => {
    const { container, debug } = render(
      <CartStateProvider>
        <MockedProvider mocks={SignedInWithCartItemsMocks}>
          <Nav />
        </MockedProvider>
      </CartStateProvider>
    );

    // Wait for redraw since there's an initial not-logged-in render
    await screen.findByText("Account");

    // Expect to find 3 (number of items) in our cart navigation item
    const cart = screen.getByText("My cart");
    expect(cart).toHaveTextContent("3");

    expect(container).toMatchSnapshot();
  });
});
