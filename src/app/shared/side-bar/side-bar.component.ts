import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
  imports: [RouterModule, CommonModule],
  standalone: true,
})
export class SideBarComponent implements OnInit {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  readonly menuItems = [
    {
      label: 'Dashboard',
      route: '/home/dashboard',
      hint: 'Overview and quick stats',
    },
    {
      label: 'Property',
      route: '/home/property',
      hint: 'Search and manage records',
    },
    {
      label: 'Bill Payment',
      route: '/home/bill-payment',
      hint: 'Process bill payments',
    },
  ];

  constructor(
    private router: Router
  ) {}

  ngOnInit() {}

  onClick(menu: string) {
    this.router.navigate([menu]);
    this.close.emit();
  }

  isActive(route: string) {
    return this.router.url.startsWith(route);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.isOpen) {
      this.close.emit();
    }
  }
}
