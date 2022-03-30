import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/react-testing";
import { SignUp, SIGN_UP_MUTATION } from "../components/SignUp";
import { CURRENT_USER_QUERY } from "../lib/useUser";
import userEvent from "@testing-library/user-event";
import { fakeUser } from "../lib/testUtils";

const MockedPassword = "hunter2";
const MockedUser = fakeUser();

const mocks = [
  // Create user mutation
  {
    request: {
      query: SIGN_UP_MUTATION,
      variables: {
        email: MockedUser.email,
        name: MockedUser.name,
        password: MockedPassword,
      },
    },
    result: {
      data: {
        createUser: {
          __typename: "User",
          id: "mocked_user",
          email: MockedUser.email,
          name: MockedUser.name,
        },
      },
    },
  },

  // Current user mock
  /*
  {
    request: {
      query: CURRENT_USER_QUERY,
    },
    result: {
      data: {
        authenticatedItem: MockedUser,
      },
    },
  },
  */
];

describe("<SignUp />", () => {
  it("Renders and matches snapshot", () => {
    const { container } = render(
      <MockedProvider>
        <SignUp />
      </MockedProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("Calls the mutation properly", async () => {
    const { container, debug } = render(
      <MockedProvider mocks={mocks}>
        <SignUp />
      </MockedProvider>
    );

    // Type into the boxes
    await userEvent.type(screen.getByPlaceholderText(/name/i), MockedUser.name);
    await userEvent.type(
      screen.getByPlaceholderText(/email/i),
      MockedUser.email
    );
    await userEvent.type(
      screen.getByPlaceholderText(/password/i),
      MockedPassword
    );

    // Click
    await userEvent.click(screen.getByText("Sign Up!"));
    await screen.findByText(
      `Signed up with ${MockedUser.email} - Please go ahead and sign in`
    );
    debug();
  });
});
