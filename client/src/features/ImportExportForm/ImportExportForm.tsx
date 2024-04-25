import { ChangeEvent, FormEvent, useState } from "react";
import { useQuery, gql, MutationFunctionOptions, FetchResult } from "@apollo/client";

import { Movement, MovementType, Product, Warehouse } from "@shared/models/types";

import "./ImportExportForm.css";

interface ImportExportFormProps {
  type: MovementType;
  selectedWarehouse: Warehouse;
  onSubmit: (options?: MutationFunctionOptions) => Promise<FetchResult>;
  onClose: () => void;
}

const GET_WAREHOUSES = gql`
  query Warehouses($hazard: Boolean) {
    warehouses(hazard: $hazard) {
      id
      name
    }
  }
`;
const GET_PRODUCTS = gql`
  query Products($hazard: Boolean) {
    products(hazard: $hazard) {
      id
      name
    }
  }
`;

const ImportExportForm = ({ type, selectedWarehouse, onSubmit, onClose }: ImportExportFormProps) => {
  const isImport = type === "import";
  const isExport = type === "export";

  const { data: warehousesData, loading: warehousesLoading, error: warehousesError } = useQuery(GET_WAREHOUSES, {
    variables: {
      hazard: selectedWarehouse.hazard
    }
  });
  const { data: productsData, loading: productsLoading, error: productsError } = useQuery(GET_PRODUCTS, {
    variables: {
      hazard: selectedWarehouse.hazard
    }
  });

  const [state, setState] = useState<Omit<Movement, "id" | "product_name" | "to_warehouse_name" | "from_warehouse_name">>({
    product_id: "",
    from_warehouse_id: isExport ? selectedWarehouse.id : "",
    to_warehouse_id: isImport ? selectedWarehouse.id : "",
    amount: 0,
    date: new Date()
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    const name = target.name;

    let value: string | number | boolean = target.value;
    if (target.type === "number" && target.value) {
      value = parseFloat(target.value);
    }

    // update form state:
    setState({ ...state, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // add import/export to movements:
      await onSubmit({
        variables: {
          movement: state
        }
      });
    } catch (e) {
      console.error("Error:", e);
    }
  };

  if (warehousesLoading || productsLoading) return <div>loading...</div>;
  if (warehousesError || productsError) return <pre>{warehousesError?.message || productsError?.message}</pre>;

  return (
    <form onSubmit={handleSubmit} className="custom-form">
      {isImport &&
        <div className="input-wrapper">
          <label htmlFor="from_warehouse_id">From</label>
          <select name="from_warehouse_id" value={state.from_warehouse_id} onChange={handleInputChange}>
            <option disabled={true} value="">- Select -</option>
            {warehousesData.warehouses.map((warehouse: Warehouse) => (
              <option key={warehouse.id} value={warehouse.id} disabled={warehouse.id === selectedWarehouse.id}>{warehouse.name}</option>
            ))}
          </select>
        </div>}

      {isExport &&
        <div className="input-wrapper">
          <label htmlFor="to_warehouse_id">To</label>
          <select name="to_warehouse_id" value={state.to_warehouse_id} onChange={handleInputChange}>
            <option disabled={true} value="">- Select -</option>
            {warehousesData.warehouses.map((warehouse: Warehouse) => (
              <option key={warehouse.id} value={warehouse.id} disabled={warehouse.id === selectedWarehouse.id}>{warehouse.name}</option>
            ))}
          </select>
        </div>}

      <div className="input-wrapper">
        <label htmlFor="product_id">Product</label>
        <select name="product_id" value={state.product_id} onChange={handleInputChange}>
          <option disabled={true} value="">- Select -</option>
          {productsData.products.map((product: Product) => (
            <option key={product.id} value={product.id}>{product.name}</option>
          ))}
        </select>
      </div>

      <div className="input-wrapper">
        <label htmlFor="amount">Amount</label>
        <input
          name="amount"
          type="number"
          value={state.amount}
          onChange={handleInputChange}
          placeholder={`Enter ${type} amount...`}
          min={0}
          max={100}
          required
        />
      </div>

      <div className="input-wrapper">
        <label htmlFor="date">Date</label>
        <input
          name="date"
          type="date"
          value={new Date(state.date).toISOString().split('T')[0]}
          onChange={handleInputChange}
          placeholder={`Enter ${type} date...`}
          required
        />
      </div>

      <div className="btn-wrapper">
        {isImport && <button className="primary" type="submit">Import</button>}
        {isExport && <button className="primary" type="submit">Export</button>}
        <button className="secondary" type="reset" onClick={onClose}>Cancel</button>
      </div>
    </form>
  );
};

export default ImportExportForm;
