import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home/home.component';
import { CreateProductComponent } from './products/create-product/create-product.component';
import { ProductsTableComponent } from './products/products-table/products-table.component';

const routes: Routes = [
  {path:"", component: HomeComponent},
  {path:"products",component: ProductsTableComponent},
  {path:"products/title/:search",component: ProductsTableComponent},
  {path:"products/description/:search",component: ProductsTableComponent},
  {path:"products/create",component: CreateProductComponent},
  {path:"products/edit/:id",component: CreateProductComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
