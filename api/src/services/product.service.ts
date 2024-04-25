import { client, deleteTransaction, insertTransaction, schema, updateTransaction } from "@/providers/postgres.provider";
import { Product } from "@shared/models/types";

const tableName = "products";

const getAllProducts = async (): Promise<Product[]> => {
  const res = await client.query(`SELECT * FROM ${schema}.${tableName} ORDER BY id ASC`);
  return res.rows;
};

const getProductById = async (id: Product["id"]): Promise<Product> => {
  const res = await client.query(`SELECT * FROM ${schema}.${tableName} WHERE id=${id}`);
  return res.rows?.[0];
};

const createProduct = async (product: Omit<Product, "id">): Promise<Product> => {
  const res = await insertTransaction(tableName, product);
  return res.rows?.[0];
};

const updateProduct = async (id: Product["id"], product: Partial<Omit<Product, "id">>): Promise<Product> => {
  const res = await updateTransaction(tableName, id, product);
  return res.rows?.[0];
};

const deleteProduct = async (id: Product["id"]): Promise<Product["id"]> => {
  const res = await deleteTransaction(tableName, id);
  return res.rows?.[0];
};

export { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
