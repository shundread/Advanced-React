import { useMutation } from "@apollo/client";
import gql from "graphql-tag";

const DELETE_PRODUCT_MUTATION = gql`
  mutation DELETE_PRODUCT_MUTATION($id: ID!) {
    deleteProduct(id: $id) {
      id
      name
    }
  }
`;

export function DeleteProduct({ id, children }) {
  const [deleteProduct, { loading }] = useMutation(DELETE_PRODUCT_MUTATION, {
    variables: { id },
  });
  function handleClick() {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteProduct().catch((error) => alert(error.message));
    }
  }
  return (
    <button disabled={loading} type="button" onClick={handleClick}>
      {children}
    </button>
  );
}
