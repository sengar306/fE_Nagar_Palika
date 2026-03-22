import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/service/auth-service';
import { PropertyManagemnetService } from '../propert-management/property-managemnet-service';
import { ErrorAlertComponent } from '../shared/ui/error-alert/error-alert.component';
import { ErrorMessageService } from '../shared/services/error-message.service';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.scss'],
  imports: [CommonModule, ErrorAlertComponent],
})
export class DashBoardComponent implements OnInit {
  propertyCount = 0;
  activePropertyCount = 0;
  draftPropertyCount = 0;
  recentProperties: any[] = [];
  zoneSnapshot: Array<{ name: string; count: number }> = [];
  userName = 'Admin User';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private propertyService: PropertyManagemnetService,
    private errorMessageService: ErrorMessageService
  ) {}

  ngOnInit() {
    this.userName = (this.authService.getTokendata() as any)?.name || 'Admin User';
    this.loadDashboard();
  }

  loadDashboard() {
    this.errorMessage = '';

    this.propertyService.getAllProperty({}).subscribe({
      next: (res: any) => {
        const records = Array.isArray(res?.body) ? res.body : [];
        this.propertyCount = records.length;
        this.activePropertyCount = records.filter((item: any) => !item.deactivateOldProperty).length;
        this.draftPropertyCount = records.filter((item: any) => !item.ptin).length;
        this.recentProperties = records.slice(0, 5);

        const grouped = records.reduce((acc: Record<string, number>, item: any) => {
          const zoneName = item?.zone?.name || 'Unassigned';
          acc[zoneName] = (acc[zoneName] || 0) + 1;
          return acc;
        }, {});

        this.zoneSnapshot = (Object.entries(grouped) as Array<[string, number]>)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 4);
      },
      error: (err) => {
        this.errorMessage = this.errorMessageService.getMessage(
          err,
          'Dashboard data could not be loaded.'
        );
      },
    });
  }
}
