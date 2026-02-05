import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { AuthStore } from '../../auth/data-access/auth.store';
import { AuthService } from '../../auth/data-access/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  imports: [BreadcrumbModule, AvatarModule, MenuModule],
  templateUrl: './topbar.html',
})
export class Topbar {
  readonly #authStore = inject(AuthStore);
  readonly #authService = inject(AuthService);
  readonly #router = inject(Router);

  items: MenuItem[] = [
    { label: 'Dashboard', routerLink: '/dashboard' },
    { label: 'Properties', routerLink: '/properties' },
  ];

  userMenuItems: MenuItem[] = [
    {
      label: 'Profile',
      icon: 'pi pi-user',
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
    },
    {
      separator: true,
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => this.onLogout(),
    },
  ];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '' };
  toggleSidebar() {
    //emit an event to the parent component
  }

  onLogout() {
    this.#authStore.logout();
    this.#router.navigate(['/login']);
  }
}
