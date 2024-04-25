import { RESTDataSource } from "@apollo/datasource-rest";

export default class WarehouseAPI extends RESTDataSource {
  override baseURL = "http://localhost:3000/warehouse/";

  async getAllWarehouses() {
    return this.get(`all`);
  }

  async getWarehouseById(id: string) {
    return this.get(`${encodeURIComponent(id)}`);
  }
}