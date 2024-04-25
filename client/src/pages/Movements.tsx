import { ChangeEvent, useState } from "react";
import { useQuery, gql, useLazyQuery } from "@apollo/client";

import { ProductAmount, Warehouse } from "@shared/models/types";
import MovementTable from "@/features/MovementTable/MovementTable";

const GET_WAREHOUSES = gql`
  query Warehouses {
    warehouses {
      id
      name
      max_amount
      hazard
    }
  }
`;
const GET_WAREHOUSE_MOVEMENTS = gql`
  query WarehouseMovements($warehouseId: ID!) {
    warehouseMovements(id: $warehouseId) {
      imports {
        id
        amount
        date
        product_name
        from_warehouse_name
      }
      exports {
        id
        amount
        date
        product_name
        to_warehouse_name
      }
      product_amounts {
        product_id
        product_unit_size
        import_amount
        export_amount
      }
    }
  }
`;

const MovementsPage = () => {
  const { data: warehousesData, loading: warehousesLoading, error: warehousesError } = useQuery(GET_WAREHOUSES);
  const [getWarehouseMovements, { data, error }] = useLazyQuery(GET_WAREHOUSE_MOVEMENTS);

  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse>();

  const handleWarehouseChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    if (!id) return;

    setSelectedWarehouse(warehousesData.warehouses.find((warehouse: Warehouse) => warehouse.id === id));

    try {
      await getWarehouseMovements({ variables: { warehouseId: id } });
      if (error) throw new Error(error.toString());
    } catch (e) {
      console.error("Error:", e);
    }
  };

  if (warehousesLoading) return <div>loading...</div>;
  if (warehousesError) return <pre>{warehousesError?.message}</pre>;

  const warehouseProductData: Record<string, number> = {};
  let stockAmount = 0;

  data?.warehouseMovements?.product_amounts?.forEach((item: ProductAmount) => {
    const productAmount = (item.import_amount * item.product_unit_size) - (item.export_amount * item.product_unit_size);

    warehouseProductData[item.product_id] = productAmount;
    stockAmount += productAmount;
  });

  return (
    <>
      <h4>Warehouse:</h4>
      <select className="w-1/2" value={selectedWarehouse?.id || ""} onChange={handleWarehouseChange}>
        <option disabled={true} value="">- Select -</option>
        {warehousesData.warehouses.map((warehouse: Warehouse) => (
          <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
        ))}
      </select>

      <hr className="w-full my-8" />

      <span>Hazard: <input type="checkbox" defaultChecked={selectedWarehouse?.hazard} disabled={true} /></span>
      <span>Current stock amount: <span className="font-bold">{stockAmount}</span></span>
      <span>Free space remaining: <span className="font-bold">{(selectedWarehouse?.max_amount || 0) - stockAmount}</span></span>

      <hr className="w-full my-8" />

      <MovementTable type="import" selectedWarehouse={selectedWarehouse} movements={data?.warehouseMovements?.imports || []} />

      <hr className="w-full my-8" />

      <MovementTable type="export" selectedWarehouse={selectedWarehouse} movements={data?.warehouseMovements?.exports || []} />
    </>
  );
};

export default MovementsPage;
