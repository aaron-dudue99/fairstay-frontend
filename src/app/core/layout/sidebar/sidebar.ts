import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthFacade } from '../../auth/data-access/auth.facade';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  readonly #authFacade = inject(AuthFacade);
  readonly #router = inject(Router);

  navItems = [
    {
      name: 'Dashboard',
      icon: 'pi pi-th-large',
      route: '/dashboard',
    },
    {
      name: 'Properties',
      icon: 'pi pi-building',
      route: '/properties',
    },
    {
      name: 'Leases',
      icon: 'pi pi-file-edit',
      route: '/leases',
    },
    {
      name: 'Payments',
      icon: 'pi pi-wallet',
      route: '/payments',
    },
    {
      name: 'Reports',
      icon: 'pi pi-chart-bar',
      route: '/reports',
    },
  ];

  onLogout() {
    this.#authFacade.logout();
    this.#router.navigate(['/login']);
  }
}
