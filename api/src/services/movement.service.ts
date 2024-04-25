import { client, insertTransaction, schema } from "@/providers/postgres.provider";
import { Movement, Product, Warehouse } from "@shared/models/types";

const defaultSelect = `
  SELECT
    movements.id,
    movements.amount,
    movements.date,
    movements.product_id,
    movements.to_warehouse_id,
    movements.from_warehouse_id,
    products.name AS product_name,
    warehouses1.name AS to_warehouse_name,
    warehouses2.name AS from_warehouse_name
  FROM ${schema}.movements movements
    LEFT JOIN ${schema}.products products ON products.id = movements.product_id
    LEFT JOIN ${schema}.warehouses warehouses1 ON warehouses1.id = movements.to_warehouse_id
    LEFT JOIN ${schema}.warehouses warehouses2 ON warehouses2.id = movements.from_warehouse_id
`;
const defaultOrder = `ORDER BY movements.date,movements.id ASC`;

const getAllMovements = async (): Promise<Movement[]> => {
  const res = await client.query(`${defaultSelect} ${defaultOrder}`);
  return res.rows;
};

const getMovementById = async (id: Movement["id"]): Promise<Movement> => {
  const res = await client.query(`${defaultSelect} WHERE movements.id=${id}`);
  return res.rows?.[0];
};

const getWarehouseImports = async (warehouseId: Warehouse["id"]): Promise<Movement[]> => {
  const res = await client.query(`${defaultSelect} WHERE movements.to_warehouse_id = ${warehouseId} ${defaultOrder}`);
  return res.rows;
};

const getWarehouseExports = async (warehouseId: Warehouse["id"]): Promise<Movement[]> => {
  const res = await client.query(`${defaultSelect} WHERE movements.from_warehouse_id = ${warehouseId} ${defaultOrder}`);
  return res.rows;
};

const getProductMovements = async (productId: Product["id"]): Promise<Movement[]> => {
  const res = await client.query(`${defaultSelect} WHERE movements.product_id = ${productId} ${defaultOrder}`);
  return res.rows;
};

const getProductWarehouseMovements = async (warehouseId: Warehouse["id"], productId: Product["id"]): Promise<Movement[]> => {
  const res = await client.query(`${defaultSelect} WHERE movements.product_id = ${productId} AND (movements.to_warehouse_id = ${warehouseId} OR movements.from_warehouse_id = ${warehouseId}) ${defaultOrder}`);
  return res.rows;
};

const getWarehouseProductAmounts = async (warehouseId: Warehouse["id"]) => {
  const res = await client.query(`
    SELECT 
      movements.product_id,
      products.unit_size AS product_unit_size,
      SUM(CASE WHEN movements.to_warehouse_id = ${warehouseId} THEN movements.amount ELSE 0 END) as import_amount,
      SUM(CASE WHEN movements.from_warehouse_id = ${warehouseId} THEN movements.amount ELSE 0 END) as export_amount
    FROM ${schema}.movements movements
      LEFT JOIN ${schema}.products products ON products.id = movements.product_id
    WHERE movements.to_warehouse_id = ${warehouseId} OR movements.from_warehouse_id = ${warehouseId}
    GROUP BY movements.product_id, products.unit_size
    ORDER BY movements.product_id ASC
  `);

  return res.rows;
};

const createMovement = async (movement: Omit<Movement, "id">): Promise<Movement> => {
  const transaction = await insertTransaction("movements", movement);
  const transactionResult = transaction.rows?.[0];

  if (!transactionResult) throw new Error("Failed to create movement");

  const res = await getMovementById(transactionResult.id);
  return res;
};

export { getAllMovements, getMovementById, getWarehouseImports, getWarehouseExports, getProductMovements, getProductWarehouseMovements, getWarehouseProductAmounts, createMovement };
