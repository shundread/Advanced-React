import { render, screen } from "@testing-library/react";
import wait from "waait";
import { CartCount } from "../components/CartCount";

describe("<CartCount />", () => {
  it("Renders", () => {
    const { container } = render(<CartCount count={10} />);
  });

  it("Matches the snapshot", () => {
    const { container } = render(<CartCount count={8} />);
    expect(container).toMatchSnapshot();
  });

  // There's an issue with this test where it depends on an animation concluding
  // so the tests will succeed. It's important to be careful here about usage of
  // expect(container.textContent).toBe instead of the more permissive test of
  // expect(container).toHaveTextContent since the latter will match in-transition
  // componets, while the former will complain about incomplete transitions
  it("Updates via props", async () => {
    const { container, rerender } = render(<CartCount count={11} />);
    expect(container.textContent).toBe("11"); // stricter test

    rerender(<CartCount count={12} />);

    // Wait for the transition to end
    await wait(400);
    expect(container.textContent).toBe("12"); // stricter test passes because of wait
  });
});
