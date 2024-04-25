import { RESTDataSource } from "@apollo/datasource-rest";

export default class MovementAPI extends RESTDataSource {
  override baseURL = "http://localhost:3000/movement/";

  async getAllMovements() {
    return this.get(`all`);
  }

  async getMovementById(id: string) {
    return this.get(`${encodeURIComponent(id)}`);
  }

  async getWarehouseMovements(id: string) {
    return this.get(`warehouse/${encodeURIComponent(id)}`);
  }

  async getProductMovements(id: string) {
    return this.get(`product/${encodeURIComponent(id)}`);
  }

  async getWarehouseProductMovements(warehouseId: string, productId: string) {
    return this.get(`warehouse/${encodeURIComponent(warehouseId)}/product/${encodeURIComponent(productId)}`);
  }

  async createMovement(movement) {
    return this.put(`create`, { body: movement });
  }
}