import { useMutation } from "@apollo/client";
import { useForm } from "../lib/useForm";
import { Form } from "./styles/Form";
import gql from "graphql-tag";
import { CURRENT_USER_QUERY } from "../lib/useUser";
import { ErrorMessage } from "./ErrorMessage";

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess {
        sessionToken
        item {
          id
          name
          email
        }
      }
      ... on UserAuthenticationWithPasswordFailure {
        code
        message
      }
    }
  }
`;

const DefaultState = {
  email: "",
  password: "",
};

export function SignIn() {
  const { inputs, handleChange, resetForm } = useForm(DefaultState);

  const [signin, { data, error, loading }] = useMutation(SIGNIN_MUTATION, {
    variables: inputs,
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  async function handleSubmit(event) {
    event.preventDefault();
    console.log(event, inputs);

    // Send the email and password to the graphqlAPI
    const result = await signin();
    console.log("Result is", result);
    resetForm();
  }

  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <ErrorMessage error={error /* GraphQL error */} />
      <ErrorMessage
        error={data?.authenticateUserWithPassword /* Authentication error */}
      />
      <fieldset disabled={loading}>
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
          Password
          <input
            type="password"
            name="password"
            placeholder="Your Password"
            autoComplete="password"
            value={inputs.password}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Sign in!</button>
      </fieldset>
    </Form>
  );
}
