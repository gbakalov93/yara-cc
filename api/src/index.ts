import express from "express";
import dotenv from "dotenv";

import { initPGClient } from "./providers/postgres.provider";

import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "@/services/product.service";
import { getAllWarehouses, getWarehouseById } from "@/services/warehouse.service";
import { createMovement, getAllMovements, getMovementById, getProductMovements, getProductWarehouseMovements, getWarehouseExports, getWarehouseImports, getWarehouseProductAmounts } from "@/services/movement.service";

dotenv.config();

const app = express();
app.use(express.json());

const port = process.env.PORT;
const url = `http://localhost:${port}`;

// product API:
app.get("/product/all", async (_, res) => {
  const products = await getAllProducts();
  res.send(products);
});
app.get("/product/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return;

  const product = await getProductById(id);
  res.send(product);
});
app.put("/product/create", async (req, res) => {
  const product = req.body;
  if (product.name == null || product.unit_size == null || product.hazard == null) return;

  const createdProduct = await createProduct(product);
  res.send({
    success: true,
    product: createdProduct
  });
});
app.post("/product/update/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return;

  const update = req.body;
  // do not update, unless we have any data passed:
  if (!update || Object.keys(update).length === 0) return;

  const updatedProduct = await updateProduct(id, update);

  res.send({
    success: true,
    product: updatedProduct
  });
});
app.delete("/product/delete/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return;

  await deleteProduct(id);
  res.send({
    success: true,
  });
});

// warehouse API:
app.get("/warehouse/all", async (_, res) => {
  const warehouses = await getAllWarehouses();
  res.send(warehouses);
});
app.get("/warehouse/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return;

  const warehouse = await getWarehouseById(id);
  res.send(warehouse);
});

// movement API:
app.get("/movement/all", async (_, res) => {
  const movements = await getAllMovements();
  res.send(movements);
});
app.get("/movement/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return;

  const movement = await getMovementById(id);
  res.send(movement);
});
app.put("/movement/create", async (req, res) => {
  const movement = req.body;
  if (movement.amount == null || movement.date == null || movement.product_id == null) return;
  if (movement.to_warehouse_id == null || movement.from_warehouse_id == null) return;

  // don't create a movement for the same warehouse:
  if (movement.from_warehouse_id === movement.to_warehouse_id) return;

  const createdMovement = await createMovement(movement);
  res.send({
    success: true,
    movement: createdMovement
  });
});
app.get("/movement/warehouse/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return;

  const imports = await getWarehouseImports(id);
  const exports = await getWarehouseExports(id);
  const product_amounts = await getWarehouseProductAmounts(id);

  res.send({
    imports,
    exports,
    product_amounts
  });
});
app.get("/movement/product/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return;

  const movements = await getProductMovements(id);
  res.send(movements);
});
app.get("/movement/warehouse/:warehouseId/product/:productId", async (req, res) => {
  const { warehouseId, productId } = req.params;
  if (!warehouseId || !productId) return;

  const movements = await getProductWarehouseMovements(warehouseId, productId);
  res.send(movements);
});

app.listen(port, async () => {
  // init Postgres client:
  await initPGClient();

  console.log(`🚀 API ready at: ${url}`);
});
