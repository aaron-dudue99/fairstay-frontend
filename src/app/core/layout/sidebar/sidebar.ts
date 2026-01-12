import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  navItems = [
    {
      name: 'Dashboard',
      icon: 'pi pi-objects-column',
      route: '/dashboard',
    },
    {
      name: 'Properties',
      icon: 'pi pi-building',
      route: '/properties',
    },
    {
      name: 'Leases',
      icon: 'pi pi-file-check',
      route: '/leases',
    },
    {
      name: 'Payments',
      icon: 'pi pi-credit-card',
      route: '/payments',
    },
  ];
}
