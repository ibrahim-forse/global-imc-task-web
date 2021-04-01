import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'GlobalIMCTask-Web';
  constructor(private route: ActivatedRoute, private router:Router){}

  navigateTo(uri: string){
    this.router.navigate([uri],{relativeTo: this.route});
  }
}
