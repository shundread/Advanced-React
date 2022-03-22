import { Order } from "../components/Order";
import { PleaseSignIn } from "../components/PleaseSignIn";

export default function OrdersPage({ query }) {
  return (
    <div>
      <PleaseSignIn>
        <Order id={query.id} />
      </PleaseSignIn>
    </div>
  );
}
