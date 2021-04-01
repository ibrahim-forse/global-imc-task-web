import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DietaryType } from 'src/app/models/dietary-type.model';
import { ProductCreateRequest } from 'src/app/models/product-create-request.model';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {
  @ViewChild('f') createProductForm: NgForm;
  availableDietaryTypes: DietaryType[];
  selectedDietaryTypes: DietaryType[] = [];
  createRequest: ProductCreateRequest;
  productId: number;
  inputProduct: Product;
  isUpdate: boolean;
  constructor(private http: HttpClient, private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.isUpdate = false;
    this.getDietaryTypes();
    this.productId = this.route.snapshot.params["id"];
    console.log(this.productId);

    if(this.productId != undefined){
      this.getProduct();
    }
    //this.availableDietaryTypes=[{id:1,name:"Diet 1"},{id:4,name:"Diet 4"},{id:3,name:"Diet 3"},{id:2,name:"Diet 2"}]
  }


  getProduct(){
    this.isUpdate = true;
    this.http.get("https://localhost:44332/api/products/"+this.productId).subscribe((product : Product)=>{
      console.log(product);
      this.inputProduct = product;
      setTimeout(() => {
        this.createProductForm.form.patchValue({
          title: this.inputProduct.title,
          description: this.inputProduct.description,
          price: this.inputProduct.price,
          vendorUID: this.inputProduct.vendorUID,
          imageURL: this.inputProduct.imageURL
        });
        this.inputProduct.dietaryTypes.forEach(element => {
          this.selectedDietaryTypes.push(element);
        });
        this.selectedDietaryTypes.forEach(element=>{
          console.log(this.availableDietaryTypes);
          var index = this.availableDietaryTypes.findIndex(a=> a.id ==element.id);
          this.availableDietaryTypes.splice(index, 1);
        });
      },);
     });
  }

  getDietaryTypes(){
     this.http.get("https://localhost:44332/api/DietaryTypes/api/dietarytypes").subscribe((diets : DietaryType[])=>{
      console.log(diets);
      this.availableDietaryTypes = diets;
     });
  }

  dietaryTypeSelected(event){
    var id = event.srcElement.id;
    var type = this.availableDietaryTypes.find(a=> a.id ==id);
    var index = this.availableDietaryTypes.findIndex(a=> a.id ==id);
    this.selectedDietaryTypes.push(type);
    this.availableDietaryTypes.splice(index, 1);
  }

  removeDietaryType(event){
    var id = event.srcElement.id;
    var type = this.selectedDietaryTypes.find(a=> a.id ==id);
    var index = this.selectedDietaryTypes.findIndex(a=> a.id ==id);
    this.availableDietaryTypes.push(type);
    this.selectedDietaryTypes.splice(index, 1);
    this.availableDietaryTypes.sort((a,b)=>a.id - b.id);
  }

  createProduct(){
    if(this.selectedDietaryTypes.length > 0){
      this.createRequest = this.createProductForm.form.value;
        this.createRequest.DietaryTypeIds = this.selectedDietaryTypes.map(a=>a.id);
        console.log(this.createRequest);
      if(this.isUpdate){


      this.http.put("https://localhost:44332/api/products/"+this.productId,this.createRequest).subscribe(()=>{
        console.log("done update");
      });
      }else{

      this.http.post("https://localhost:44332/api/products",this.createRequest).subscribe(()=>{
        console.log("done create");
      });
    }
    }
  }
}
