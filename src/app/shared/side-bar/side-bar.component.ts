import { Component, Input, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],  
    imports: [RouterModule],
  standalone:true

})
export class SideBarComponent  implements OnInit {
  @Input() isOpen = false;
  constructor(private router:Router) { }

  ngOnInit() {}
     selectedMenu = signal<string>('dashboard');
 onClick(menu: string) {
  this.isOpen=false
this.router.navigate([menu]);
  }

}
