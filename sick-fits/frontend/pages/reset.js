import { RequestReset } from "../components/RequestReset";
import { Reset } from "../components/Reset";

export default function ResetPage({ query }) {
  if (!query?.token) {
    return (
      <div>
        <p>Sorry but you must supply a password</p>
        <RequestReset />
      </div>
    );
  }
  return (
    <div>
      <Reset token={query.token} />
    </div>
  );
}
