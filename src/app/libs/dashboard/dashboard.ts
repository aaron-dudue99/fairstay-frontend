import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  readonly currentDate = new Date();

  stats = [
    { label: 'Total Properties', value: '12', icon: 'pi pi-building', color: 'text-blue-400', borderColor: 'border-blue-400/30', bg: 'bg-blue-400/10' },
    { label: 'Active Leases', value: '8', icon: 'pi pi-file-check', color: 'text-green-400', borderColor: 'border-green-400/30', bg: 'bg-green-400/10' },
    { label: 'Pending Payments', value: '$2,450', icon: 'pi pi-wallet', color: 'text-yellow-400', borderColor: 'border-yellow-400/30', bg: 'bg-yellow-400/10' },
    { label: 'Occupancy Rate', value: '85%', icon: 'pi pi-chart-pie', color: 'text-purple-400', borderColor: 'border-purple-400/30', bg: 'bg-purple-400/10' },
  ];

  recentActivities = [
    { title: 'Rent Received', desc: 'Unit 4B - March Rent', time: '2h ago', icon: 'pi pi-check', color: 'text-green-400', bg: 'bg-green-500/10' },
    { title: 'New Lease Signed', desc: 'Unit 12A - John Doe', time: '5h ago', icon: 'pi pi-file', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { title: 'Maintenance Request', desc: 'Unit 2C - Leaking Tap', time: '1d ago', icon: 'pi pi-wrench', color: 'text-orange-400', bg: 'bg-orange-500/10' },
  ];
}
