export class ProductCreateRequest {
  id: string;
  title: string;
  description: string;
  price: number;
  imageURL: string;
  DietaryTypeIds: number[];
  vendorUID: string;
  views: number;
}
