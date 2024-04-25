import { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";

import ProductForm from "@/features/ProductForm/ProductForm";
import { Product } from "@shared/models/types";

interface ProductPageState {
  selected: Product | null;
  isFormVisible: boolean;
}

const GET_PRODUCTS = gql`
  query Products {
    products {
      id
      name
      unit_size
      hazard
    }
  }
`;
const CREATE_PRODUCT = gql`
  mutation CreateProduct($product: CreateProduct!) {
    createProduct(product: $product) {
      product {
        id
        name
        unit_size
        hazard
      }
      success
    }
  }
`;
const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $product: UpdateProduct) {
    updateProduct(id: $id, product: $product) {
      product {
        id
        name
        unit_size
        hazard
      }
      success
    }
  }
`;
const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      success
    }
  }
`;

const ProductsPage = () => {
  const { data, loading, error } = useQuery(GET_PRODUCTS);

  const [createProduct] = useMutation(CREATE_PRODUCT, { refetchQueries: ["Products"] });
  const [updateProduct] = useMutation(UPDATE_PRODUCT, { refetchQueries: ["Products"] });
  const [deleteProduct] = useMutation(DELETE_PRODUCT, { refetchQueries: ["Products"] });

  const [state, setState] = useState<ProductPageState>({
    selected: null,
    isFormVisible: false,
  });

  const toggleForm = (product?: Product) => {
    setState({
      ...state,
      selected: product || null,
      isFormVisible: !!product || !state.isFormVisible
    });
  };

  const handleDelete = async (product: Product) => {
    const { id } = product;
    if (!id) return;

    try {
      await deleteProduct({ variables: { id } });
    } catch (e) {
      console.error("Error:", e);
    }
  };

  if (loading) return <div>loading...</div>;
  if (error) return <pre>{error.message}</pre>;

  return (
    <>
      {state.isFormVisible ?
        <ProductForm product={state.selected} onSubmit={state.selected ? updateProduct : createProduct} onClose={() => toggleForm()} /> :
        <button className="primary" onClick={() => toggleForm()}>Add Product</button>}

      <hr className="w-full my-8" />

      <table className="w-full table-auto text-sm text-gray-500 shadow-md">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr className="*:px-2 *:py-4">
            <th scope="col">Name</th>
            <th scope="col" className="w-28">SpU</th>
            <th scope="col" className="w-16">Hazard</th>
            <th scope="col" className="w-32">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.products.map((product: Product, index: number) => (
            <tr className="bg-white border-b *:p-4" key={index}>
              <th scope="row" className="text-left font-medium text-gray-900 whitespace-nowrap">{product.name}</th>
              <td>{product.unit_size}</td>
              <td className="w-4">
                <div className="flex justify-center">
                  <input type="checkbox" defaultChecked={product.hazard} disabled={true} className="text-blue-600 bg-gray-100 border-gray-300 rounded" />
                </div>
              </td>
              <td>
                <button className="font-medium text-blue-600 hover:underline" onClick={() => toggleForm(product)}>Edit</button>
                <button className="font-medium text-red-600 hover:underline ms-3" onClick={() => handleDelete(product)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ProductsPage;
