import { Pagination } from "../components/Pagination";
import { Products } from "../components/Products";

export default function ProductsPage({ page }) {
  return (
    <div>
      <Pagination page={1} />
      <Products />
      <Pagination page={1} />
    </div>
  );
}
