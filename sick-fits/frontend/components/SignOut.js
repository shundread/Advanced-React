import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { CURRENT_USER_QUERY } from "../lib/useUser";

const SIGN_OUT_MUTATION = gql`
  mutation SIGN_OUT_MUTATION {
    endSession
  }
`;

export function SignOut() {
  const router = useRouter();
  const [signout, { data, error, loading }] = useMutation(SIGN_OUT_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  async function handleSignout() {
    const result = await signout();
    if (result.endSession) {
      router.push("/");
    }
  }

  return (
    <button type="button" onClick={handleSignout}>
      Sign Out
    </button>
  );
}
