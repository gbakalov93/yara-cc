import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FetchResult, MutationFunctionOptions } from "@apollo/client";

import { Product } from "@shared/models/types";

import "./ProductForm.css";

interface ProductFormProps {
  product: Product | null;
  onSubmit: (options?: MutationFunctionOptions) => Promise<FetchResult>;
  onClose: () => void;
}

const defaultState: Omit<Product, "id"> = {
  name: '',
  unit_size: 0,
  hazard: false,
};

const ProductForm = ({ product, onSubmit, onClose }: ProductFormProps) => {
  const isUpdate = product != null;
  const [state, setState] = useState(defaultState);

  useEffect(() => {
    if (product) {
      const { name, unit_size, hazard } = product;
      setState({ name, unit_size, hazard, });
    }
  }, [product]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const name = target.name;

    let value: string | number | boolean = target.value;
    if (target.type === "checkbox") {
      value = target.checked;
    }
    if (target.type === "number" && target.value) {
      value = parseFloat(target.value);
    }

    // update form state:
    setState({ ...state, [name]: value, });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await onSubmit({
        variables: {
          product: state,
          ...isUpdate && { id: product.id }
        }
      });

      // clear up the form on create:
      if (!isUpdate) {
        setState(defaultState);
      }
    } catch (e) {
      console.error("Error:", e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="custom-form">
      <div className="input-wrapper">
        <label htmlFor="name">Name</label>
        <input
          name="name"
          type="text"
          value={state.name}
          onChange={handleInputChange}
          placeholder={`Enter product name...`}
          required
        />
      </div>

      <div className="input-wrapper">
        <label htmlFor="unit_size">Size per unit</label>
        <input
          name="unit_size"
          type="number"
          value={state.unit_size}
          min={0.1}
          step={0.1}
          onChange={handleInputChange}
          placeholder={`Enter product size per unit...`}
          required
        />
      </div>

      <div className="input-wrapper">
        <label htmlFor="hazard">Hazard</label>
        <input
          name="hazard"
          type="checkbox"
          className="block"
          checked={state.hazard}
          onChange={handleInputChange}
        />
      </div>

      <div className="btn-wrapper">
        <button className="primary" type="submit">{isUpdate ? "Update" : "Create"}</button>
        <button className="secondary" type="reset" onClick={onClose}>Cancel</button>
      </div>
    </form>
  );
};

export default ProductForm;
