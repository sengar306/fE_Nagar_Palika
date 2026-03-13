import { Component, EventEmitter, HostListener, Input, OnInit, Output, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ClickOutsideDirective } from "src/app/directive/click-outside";

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],  
    imports: [RouterModule, ClickOutsideDirective],
  standalone:true

})
export class SideBarComponent  implements OnInit {
  @Input() isOpen = false;
  constructor(private router:Router) { }
@Output() close=new EventEmitter()
  ngOnInit() {}
     selectedMenu = signal<string>('dashboard');
 onClick(menu: string) {
  this.isOpen=false
this.router.navigate([menu]);
  }


   
    @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {

    const sidebar = document.querySelector('app-side-bar');
    const menuBtn = document.querySelector('.menu-btn');

    if (
      this.isOpen &&
      sidebar && 
      !sidebar.contains(event.target as Node) &&
      menuBtn && 
      !menuBtn.contains(event.target as Node)
    ) {
     this.close.emit()
    }

  }

}

