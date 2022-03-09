import { useMutation } from "@apollo/client";
import { useForm } from "../lib/useForm";
import { Form } from "./styles/Form";
import gql from "graphql-tag";
import { ErrorMessage } from "./ErrorMessage";

const RESET_PASSWORD_MUTATION = gql`
  mutation RESET_PASSWORD_MUTATION(
    $email: String!
    $password: String!
    $token: String!
  ) {
    redeemUserPasswordResetToken(
      email: $email
      password: $password
      token: $token
    ) {
      code
      message
    }
  }
`;

const DefaultState = {
  email: "",
  password: "",
};

export function Reset({ token }) {
  const { inputs, handleChange, resetForm } = useForm(DefaultState);

  const [reset, { data, error, loading }] = useMutation(
    RESET_PASSWORD_MUTATION,
    {
      variables: {
        email: inputs.email,
        password: inputs.password,
        token,
      },
      // refetchQueries: [{ query: CURRENT_USER_QUERY }], <- The operation creates the user but does not sign it
    }
  );

  async function handleSubmit(event) {
    event.preventDefault();

    // Send the email, name and password to the graphqlAPI
    const result = await reset().catch(console.error);
    resetForm();
  }

  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <h2>Reset Your Password</h2>
      <ErrorMessage error={error /* GraphQL error */} />
      <ErrorMessage
        error={data?.redeemUserPasswordResetToken /* Authentication error */}
      />
      <fieldset disabled={loading}>
        {data?.redeemUserPasswordResetToken === null && !error && (
          <p>Success! You can now sign in.</p>
        )}
        <label htmlFor="email">
          Email
          <input
            type="email"
            name="email"
            placeholder="Your Email Address"
            autoComplete="email"
            value={inputs.email}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="password">
          New Password
          <input
            type="password"
            name="password"
            placeholder="New Password"
            autoComplete="password"
            value={inputs.password}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Request Password Reset!</button>
      </fieldset>
    </Form>
  );
}
