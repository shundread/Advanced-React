import { useUser } from "../lib/useUser";
import { SignIn } from "./SignIn";

export function RenderIfSignedIn({ children }) {
  const user = useUser();
  if (!user) {
    return null;
  }
  return children;
}
