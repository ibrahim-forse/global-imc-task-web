import { Product } from "./product.model";

export class ProductTable {
  products: Product[];
  currentPage: number;
  totalPages: number;
  isLastPage: boolean;
}
