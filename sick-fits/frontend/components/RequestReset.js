import { useMutation } from "@apollo/client";
import { useForm } from "../lib/useForm";
import { Form } from "./styles/Form";
import gql from "graphql-tag";
import { ErrorMessage } from "./ErrorMessage";

const REQUEST_RESET_PASSWORD_MUTATION = gql`
  mutation REQUEST_RESET_PASSWORD_MUTATION($email: String!) {
    sendUserPasswordResetLink(email: $email) {
      code
      message
    }
  }
`;

const DefaultState = {
  email: "",
};

export function RequestReset() {
  const { inputs, handleChange, resetForm } = useForm(DefaultState);

  const [signup, { data, error, loading }] = useMutation(
    REQUEST_RESET_PASSWORD_MUTATION,
    {
      variables: inputs,
      // refetchQueries: [{ query: CURRENT_USER_QUERY }], <- The operation creates the user but does not sign it
    }
  );

  async function handleSubmit(event) {
    event.preventDefault();

    // Send the email, name and password to the graphqlAPI
    const result = await signup().catch(console.error);
    resetForm();
  }

  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <h2>Forgot Your Password?</h2>
      <ErrorMessage error={error /* GraphQL error */} />
      <ErrorMessage
        error={data?.sendUserPasswordResetLink /* Authentication error */}
      />
      <fieldset disabled={loading}>
        {data?.sendUserPasswordResetLink === null && !error && (
          <p>Success! Check your email for a link!</p>
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
        <button type="submit">Request Password Reset!</button>
      </fieldset>
    </Form>
  );
}
