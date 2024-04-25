import { client, schema } from "@/providers/postgres.provider";
import { Warehouse } from "@shared/models/types";

const tableName = "warehouses";

const getAllWarehouses = async (): Promise<Warehouse[]> => {
  const res = await client.query(`SELECT * FROM ${schema}.${tableName} ORDER BY id ASC`);
  return res.rows;
};

const getWarehouseById = async (id: string): Promise<Warehouse> => {
  const res = await client.query(`SELECT * FROM ${schema}.${tableName} WHERE id=${id}`);
  return res.rows?.[0];
};

export { getAllWarehouses, getWarehouseById };
