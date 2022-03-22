import { Orders } from "../components/Orders";
import { PleaseSignIn } from "../components/PleaseSignIn";

export default function OrdersPage() {
  return (
    <div>
      <PleaseSignIn>
        <Orders />
      </PleaseSignIn>
    </div>
  );
}
