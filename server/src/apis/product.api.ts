import { RESTDataSource } from "@apollo/datasource-rest";

export default class ProductAPI extends RESTDataSource {
  override baseURL = "http://localhost:3000/product/";

  async getAllProducts() {
    return this.get(`all`);
  }

  async getProductById(id: string) {
    return this.get(`${encodeURIComponent(id)}`);
  }

  async createProduct(product) {
    return this.put(`create`, { body: product });
  }

  async updateProduct(id: string, product) {
    return this.post(`update/${encodeURIComponent(id)}`, { body: product });
  }

  async deleteProduct(id: string) {
    return this.delete(`delete/${encodeURIComponent(id)}`);
  }
}