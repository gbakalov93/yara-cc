import { useState } from "react";

import { Movement, MovementType, Warehouse } from "@shared/models/types";
import { gql, useMutation } from "@apollo/client";

import ImportExportForm from "../ImportExportForm/ImportExportForm";
import "./MovementTable.css";

interface MovementTableProps {
  type: MovementType;
  selectedWarehouse?: Warehouse;
  movements: Movement[],
}

const CREATE_MOVEMENT = gql`
  mutation CreateMovement($movement: CreateMovement!) {
    createMovement(movement: $movement) {
      movement {
        id
        amount
        date
        product_name
        from_warehouse_name
        to_warehouse_name
      }
      success
    }
  }
`;

const MovementTable = ({ type, selectedWarehouse, movements }: MovementTableProps) => {
  const title = type === "import" ? "Import" : "Export";

  const [createMovement] = useMutation(CREATE_MOVEMENT, { refetchQueries: ["WarehouseMovements"] });
  const [state, setState] = useState({
    isFormVisible: false
  });

  const toggleForm = () => {
    setState({
      isFormVisible: !state.isFormVisible
    });
  };

  return (
    <>
      {selectedWarehouse && state.isFormVisible ?
        <ImportExportForm type={type} selectedWarehouse={selectedWarehouse} onSubmit={createMovement} onClose={() => toggleForm()} /> :
        <button className="primary" disabled={!selectedWarehouse} onClick={() => toggleForm()}>New {title}</button>}

      <h4>{title}s:</h4>
      <table className="w-full table-auto text-sm text-gray-500 shadow-md">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr className="*:px-2 *:py-4">
            <th scope="col">Product</th>
            <th scope="col" className="w-48">{type === "import" ? "From" : "To"}</th>
            <th scope="col" className="w-28">Amount</th>
            <th scope="col" className="w-40">Date</th>
          </tr>
        </thead>
        <tbody>
          {movements.map((item: Movement, index: number) => (
            <tr className="bg-white border-b *:p-4" key={index}>
              <th scope="row" className="text-left font-medium text-gray-900 whitespace-nowrap">{item.product_name}</th>
              <td>{type === "import" ? item.from_warehouse_name : item.to_warehouse_name}</td>
              <td>{item.amount}</td>
              <td>{new Date(item.date).toDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default MovementTable;
