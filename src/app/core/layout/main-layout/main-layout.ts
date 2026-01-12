import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Sidebar } from '../sidebar/sidebar';
import { Topbar } from '../topbar/topbar';
@Component({
  selector: 'app-main-layout',
  imports: [CommonModule, ButtonModule, CardModule, Sidebar, Topbar, RouterOutlet],
  templateUrl: './main-layout.html',
})
export class MainLayout {
  sidebarVisible = true;

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
}
