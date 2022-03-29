import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/react-testing";
import { Pagination } from "../components/Pagination";
import { expectLink, makePaginationMocksFor } from "../lib/testUtils";

describe("<Pagination />", () => {
  it("Displays a loading message", () => {
    const { container } = render(
      <MockedProvider mocks={makePaginationMocksFor(1)}>
        <Pagination />
      </MockedProvider>
    );

    expect(container).toHaveTextContent("Loading");
  });

  it("Renders pagination for 18 items", async () => {
    const { container } = render(
      <MockedProvider mocks={makePaginationMocksFor(18)}>
        <Pagination page={1} />
      </MockedProvider>
    );

    await screen.findByTestId("pagination");
    expectLink({
      container,
      text: /Next/,
      url: "/products/2",
    });
    expectLink({
      container,
      text: /Prev/,
      url: "/products/0",
    });
    expect(container).toHaveTextContent("Page 1 of 5");
  });

  it("Disables the prev page on page 1", async () => {
    const { container, debug } = render(
      <MockedProvider mocks={makePaginationMocksFor(18)}>
        <Pagination page={1} />
      </MockedProvider>
    );

    await screen.findByTestId("pagination");
    const prev = screen.getByText(/Prev/);
    expect(prev).toHaveAttribute("aria-disabled", "true");
    const next = screen.getByText(/Next/);
    expect(next).toHaveAttribute("aria-disabled", "false");
  });

  it("Disables the next page on last page", async () => {
    const { container } = render(
      <MockedProvider mocks={makePaginationMocksFor(18)}>
        <Pagination page={Math.ceil(18 / 4)} />
      </MockedProvider>
    );

    await screen.findByTestId("pagination");
    const prev = screen.getByText(/Prev/);
    expect(prev).toHaveAttribute("aria-disabled", "false");
    const next = screen.getByText(/Next/);
    expect(next).toHaveAttribute("aria-disabled", "true");
  });

  it("Enables prev page and next page on a middle page", async () => {
    const { container } = render(
      <MockedProvider mocks={makePaginationMocksFor(18)}>
        <Pagination page={2} />
      </MockedProvider>
    );

    await screen.findByTestId("pagination");

    const prev = screen.getByText(/Prev/);
    expect(prev).toHaveAttribute("aria-disabled", "false");
    const next = screen.getByText(/Next/);
    expect(next).toHaveAttribute("aria-disabled", "false");
  });
});
