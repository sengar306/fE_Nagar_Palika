import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/service/auth-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
})
export class HeaderComponent implements OnInit {
  @Output() menuToggle = new EventEmitter<void>();

  tokenData: any;
  isDark = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  toggleSidebar() {
    this.menuToggle.emit();
  }

  toggleTheme() {
    this.isDark = !this.isDark;

    if (this.isDark) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
      return;
    }

    document.body.classList.remove('dark-theme');
    localStorage.setItem('theme', 'light');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }

  ngOnInit() {
    this.tokenData = this.auth.getTokendata();

    const theme = localStorage.getItem('theme');

    if (theme === 'dark') {
      this.isDark = true;
      document.body.classList.add('dark-theme');
    }
  }
}
