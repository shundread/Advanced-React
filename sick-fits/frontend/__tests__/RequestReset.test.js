import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/react-testing";
import userEvent from "@testing-library/user-event";
import { fakeUser } from "../lib/testUtils";
import {
  RequestReset,
  REQUEST_RESET_PASSWORD_MUTATION,
} from "../components/RequestReset";

const MockedUser = fakeUser();

const mocks = [
  {
    request: {
      query: REQUEST_RESET_PASSWORD_MUTATION,
      variables: { email: MockedUser.email },
    },
    result: {
      data: { sendUserPasswordResetLink: null },
    },
  },
];

describe("<RequestReset />", () => {
  it("Renders and matches the snapshot", () => {
    const { container } = render(
      <MockedProvider>
        <RequestReset />
      </MockedProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it("Calls the mutation when submitted", async () => {
    const { container } = render(
      <MockedProvider mocks={mocks}>
        <RequestReset />
      </MockedProvider>
    );

    // Type into the email box
    userEvent.type(screen.getByPlaceholderText(/email/i), MockedUser.email);
    userEvent.click(screen.getByText("Request Password Reset!"));

    const success = await screen.findByText(/success/i);
    expect(success).toBeInTheDocument();
  });
});
