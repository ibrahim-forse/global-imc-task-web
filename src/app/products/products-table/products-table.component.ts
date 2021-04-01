import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductTable } from 'src/app/models/product-table.model';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: ['./products-table.component.css']
})
export class ProductsTableComponent implements OnInit, OnDestroy {


  products : Product[];

  paramsSubscription: Subscription;
  searchTermSubscription: Subscription;

  page: number;
  pageSize: number = 5;

  searchTitle: boolean;
  searchTermInput: string;

  currentPage: number;
  totalPages: number;
  startPage: number;
  endPage: number;
  isLastPage: boolean;

  constructor(private route: ActivatedRoute, private router: Router, private http : HttpClient) { }

  ngOnInit(): void {
    this.searchTitle = true;
    this.searchTermSubscription = this.route.params.subscribe((params)=>{
      this.searchTermInput = this.route.snapshot.params['search'];
      if(this.route.snapshot.url.length > 1){
        if(this.route.snapshot.url[1].path == 'title'){
          this.searchTitle = true;
        }
        else if(this.route.snapshot.url[1].path == 'description'){
          this.searchTitle = false;
        }
        this.searchProducts();
      }
    });


    this.paramsSubscription = this.route.queryParams.subscribe((queryParams)=>{
      this.page = queryParams['page'];

      console.log(this.page);
      if(this.page === undefined)
      this.page = 1;

      if(this.searchTermInput == undefined){
        this.getProductsData();

      }else{
        this.searchProducts();
      }
    });

  }

  ngOnDestroy(){
    this.paramsSubscription.unsubscribe();
    this.searchTermSubscription.unsubscribe();
  }

  getProductsData(){
    this.http.get('https://localhost:44332/api/products/'+this.page+"/"+this.pageSize).subscribe((data : ProductTable)=>{
      this.products = data.products;
      this.currentPage = data.currentPage;
      this.totalPages = data.totalPages;
      this.isLastPage = data.isLastPage;
      console.log(data);
      this.calculatePaging();
    });
  }

  searchInvoke(){
    if(this.searchTermInput){
      if(this.searchTitle){
        this.router.navigate(['../products/title/'+this.searchTermInput],{
          queryParams: {
            page:1
          },
          queryParamsHandling: "merge"
        });
      }else{
        this.router.navigate(['../products/description/'+this.searchTermInput],{
          queryParams: {
            page: '1'
          },
          queryParamsHandling: "merge"
        });
      }
    }else{
      this.router.navigate(['../products/']);
    }
  }

  searchProducts(){
    if(this.searchTitle){
      this.http.get('https://localhost:44332/api/products/title/'+this.searchTermInput+"/"+this.page+"/"+this.pageSize).subscribe((data : ProductTable)=>{
        this.products = data.products;
        this.currentPage = data.currentPage;
        this.totalPages = data.totalPages;
        this.isLastPage = data.isLastPage;
        this.calculatePaging();
      });
    }else {
      this.http.get('https://localhost:44332/api/products/description/'+this.searchTermInput+"/"+this.page+"/"+this.pageSize).subscribe((data : ProductTable)=>{
        this.products = data.products;
        this.currentPage = data.currentPage;
        this.totalPages = data.totalPages;
        this.isLastPage = data.isLastPage;
        this.calculatePaging();
      });
    }
  }

  toggleSearchDescription(event) {
    if ( event.target.checked )
      this.searchTitle = false;
    console.log("Search Title: "+this.searchTitle);
  }

  toggleSearchTitle(event) {
    if ( event.target.checked )
      this.searchTitle = true;
    console.log("Search Title: "+this.searchTitle);
  }

  deleteProduct(event){
    var id = event.srcElement.id;
    console.log(id);
    this.deleteProductRequest(id);
  }

  deleteProductRequest(id: number){
    this.http.delete('https://localhost:44332/api/products/'+id).subscribe(()=>{
      this.getProductsData();
    });
  }

  calculatePaging(){
    this.startPage = this.page - 5;
    this.endPage = this.page + 4;

    if (this.startPage <= 0)
    {
        this.endPage -= (this.startPage - 1);
        this.startPage = 1;
    }
    if (this.endPage > this.totalPages)
    {
        this.endPage = this.totalPages;
        if (this.endPage > 10)
        {
            this.startPage = this.endPage - 9;
        }
    }
  }

  createRange(start:number, end:number){
    var items: number[] = [];
    for(var i = start; i <= end; i++){
       items.push(i);
    }
    return items;
  }

  navigatePaging(pageNumber: number){
    this.router.navigate(['./'],{
      relativeTo:this.route,
      queryParams: {page:pageNumber},
      queryParamsHandling: "merge"
    });
  }
}
