export type Product = {
  id: string;
  name: string;
  unit_size: number;
  hazard: boolean;
};

export type Warehouse = {
  id: string;
  name: string;
  max_amount: number;
  hazard: boolean;
};

export type MovementType = "import" | "export";
export type Movement = {
  id: string;
  amount: number;
  date: Date;
  product_id: Product["id"];
  product_name: Product["name"];
  to_warehouse_id: Warehouse["id"];
  to_warehouse_name: Warehouse["name"];
  from_warehouse_id?: Warehouse["id"];
  from_warehouse_name?: Warehouse["name"];
};

export type ProductAmount = {
  product_id: Product["id"],
  product_unit_size: Product["unit_size"];
  import_amount: Movement["amount"];
  export_amount: Movement["amount"];
};

export type WarehouseMovements = {
  imports: Movement[];
  exports: Movement[];
  product_amounts: ProductAmount[];
};
