import { DietaryType } from "./dietary-type.model";

export class Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageURL: string;
  dietaryTypes: DietaryType[];
  vendorUID: string;
  viewsCount: number;
}
