import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/auth/service/auth-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone:true
})
export class HeaderComponent  implements OnInit {
@Output() menuToggle = new EventEmitter<void>();

  toggleSidebar() {
    this.menuToggle.emit();
  }
  constructor(private auth:AuthService) { }
tokenData:any
 
isDark = false;



toggleTheme(){

  this.isDark = !this.isDark;

  if(this.isDark){
    document.body.classList.add('dark-theme');
    localStorage.setItem('theme','dark');
  }else{
    document.body.classList.remove('dark-theme');
    localStorage.setItem('theme','light');
  }

}

ngOnInit(){
    this.tokenData=this.auth.getTokendata()
  const theme = localStorage.getItem('theme');

  if(theme === 'dark'){
    this.isDark = true;
    document.body.classList.add('dark-theme');
  }

}
}
