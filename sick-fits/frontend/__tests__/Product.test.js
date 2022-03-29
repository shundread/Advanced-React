import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/react-testing";
import { Product } from "../components/Product";
import { fakeItem } from "../lib/testUtils";

const product = fakeItem();

describe("<Product />", () => {
  it("Renders out the price tag and title", () => {
    const { container, debug } = render(
      <MockedProvider>
        <Product product={product} />
      </MockedProvider>
    );
    const priceTag = screen.getByText("$50.00");
    expect(priceTag).toBeInTheDocument();

    const link = container.querySelector("a");
    expect(link).toHaveAttribute("href", "/product/abc123");
    expect(link).toHaveTextContent(product.name);
  });

  it("Renders and matches the snapshot", () => {
    const { container } = render(
      <MockedProvider>
        <Product product={product} />
      </MockedProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it("Renders the image properly", () => {
    render(
      <MockedProvider>
        <Product product={product} />
      </MockedProvider>
    );

    // Grab the image
    const img = screen.getByAltText(product.name);
    expect(img).toBeInTheDocument();
  });
});
