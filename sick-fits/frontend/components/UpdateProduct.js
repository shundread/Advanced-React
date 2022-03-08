import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { useForm } from "../lib/useForm";
import { ErrorMessage } from "./ErrorMessage";
import { Form } from "./styles/Form";

const SINGLE_PRODUCT_QUERY = gql`
  query SINGLE_PRODUCT_QUERY($id: ID!) {
    Product(where: { id: $id }) {
      id
      name
      description
      price
    }
  }
`;

const UPDATE_PRODUCT_MUTATION = gql`
  mutation UPDATE_PRODUCT_MUTATION(
    $id: ID!
    $name: String
    $description: String
    $price: Int
  ) {
    updateProduct(
      id: $id
      data: { name: $name, description: $description, price: $price }
    ) {
      id
      name
      description
      price
    }
  }
`;

const EmptyProduct = {
  image: "",
  name: "",
  price: 0,
  description: "",
};

export function UpdateProduct({ id }) {
  // 1. We need to get the existing product
  const queryResponse = useQuery(SINGLE_PRODUCT_QUERY, { variables: { id } });

  // 2. We need to get the mutation to update the product
  const [updateProduct, mutationResponse] = useMutation(
    UPDATE_PRODUCT_MUTATION
  );

  // 2.5 Create some state for the form inputs:
  const { inputs, clearForm, handleChange, resetForm } = useForm(
    queryResponse.data?.Product
  );

  // 3. We need the form to handle the updates
  async function handleSubmit(event) {
    event.preventDefault();
    const result = await updateProduct({
      variables: {
        id,
        name: inputs.name,
        description: inputs.description,
        price: inputs.price,
      },
    });
    console.log(result);
  }

  if (queryResponse.loading) return <p>Loading...</p>;

  return (
    <Form onSubmit={handleSubmit}>
      <ErrorMessage error={queryResponse.error || mutationResponse.error} />
      <fieldset
        disabled={mutationResponse.loading}
        aria-busy={mutationResponse.loading}
      >
        <label htmlFor="name">
          Name
          <input
            required
            id="name"
            name="name"
            placeholder="Name"
            type="text"
            value={inputs.name}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="price">
          Price
          <input
            required
            id="price"
            name="price"
            placeholder="Price"
            type="number"
            value={inputs.price}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="description">
          Description
          <textarea
            required
            id="description"
            name="description"
            placeholder="Description"
            value={inputs.description}
            onChange={handleChange}
          />
        </label>
      </fieldset>
      <button type="submit">Update Product</button>
    </Form>
  );
}
