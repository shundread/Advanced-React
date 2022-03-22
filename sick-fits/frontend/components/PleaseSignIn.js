import { useUser } from "../lib/useUser";
import { SignIn } from "./SignIn";

export function PleaseSignIn({ children }) {
  const user = useUser();
  if (!user) {
    return <SignIn />;
  }
  return children;
}
