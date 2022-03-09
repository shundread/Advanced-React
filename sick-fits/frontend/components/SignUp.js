import { useMutation } from "@apollo/client";
import { useForm } from "../lib/useForm";
import { Form } from "./styles/Form";
import gql from "graphql-tag";
import { CURRENT_USER_QUERY } from "../lib/useUser";
import { ErrorMessage } from "./ErrorMessage";

const SIGN_IN_MUTATION = gql`
  mutation SIGN_UP_USER($email: String!, $name: String!, $password: String!) {
    createUser(data: { email: $email, name: $name, password: $password }) {
      id
      email
      name
    }
  }
`;

const DefaultState = {
  email: "",
  name: "",
  password: "",
};

export function SignUp() {
  const { inputs, handleChange, resetForm } = useForm(DefaultState);

  const [signup, { data, error, loading }] = useMutation(SIGN_IN_MUTATION, {
    variables: inputs,
    // refetchQueries: [{ query: CURRENT_USER_QUERY }], <- The operation creates the user but does not sign it
  });

  async function handleSubmit(event) {
    event.preventDefault();

    // Send the email, name and password to the graphqlAPI
    const result = await signup().catch(console.error);
    console.log("Result is", result);
    resetForm();
  }

  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <h2>Sign Up For an Account</h2>
      <ErrorMessage error={error /* GraphQL error */} />
      <ErrorMessage error={data?.createUser /* Authentication error */} />
      <fieldset disabled={loading}>
        {data?.createUser && (
          <p>
            Signed up with {data.createUser.email} - Please go ahead and sign in
          </p>
        )}
        <label htmlFor="name">
          Your Name
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            autoComplete="name"
            value={inputs.name}
            onChange={handleChange}
          />
        </label>
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
        <button type="submit">Sign Up!</button>
      </fieldset>
    </Form>
  );
}
