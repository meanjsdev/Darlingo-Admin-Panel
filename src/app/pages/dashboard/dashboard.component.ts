import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faUsers, 
  faChartLine, 
  faDollarSign, 
  faBell, 
  faCalendarAlt, 
  faArrowUp, 
  faArrowDown,
  faEllipsisV,
  faPlus,
  faUserPlus,
  faFileAlt,
  faChartBar,
  faCog,
  faGlobe,
  faLanguage
} from '@fortawesome/free-solid-svg-icons';
import { DashboardService } from '../../services/dashboard.service';

interface StatCard {
  title: string;
  value: string | number;
  change: number;
  icon: any;
  color: string;
  trend: 'up' | 'down';
}

interface Activity {
  id: number;
  user: string;
  action: string;
  time: string;
  avatar: string;
  status: 'completed' | 'pending' | 'failed';
}

interface Project {
  id: number;
  name: string;
  progress: number;
  status: 'on-track' | 'delayed' | 'completed';
  team: string[];
  deadline: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FontAwesomeModule, 
    FormsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Icons
  faUsers = faUsers;
  faChartLine = faChartLine;
  faDollarSign = faDollarSign;
  faBell = faBell;
  faCalendarAlt = faCalendarAlt;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  faEllipsisV = faEllipsisV;
  faPlus = faPlus;
  faUserPlus = faUserPlus;
  faFileAlt = faFileAlt;
  faChartBar = faChartBar;
  faCog = faCog;
  faGlobe = faGlobe;
  faLanguage = faLanguage;

  // Stats
  stats = signal<StatCard[]>([
    {
      title: 'Registered Users',
      value: '0',
      change: 0,
      icon: this.faUsers,
      color: 'bg-blue-500',
      trend: 'up'
    },
    {
      title: 'Active Subscribers',
      value: '0',
      change: 0,
      icon: this.faUsers,
      color: 'bg-green-500',
      trend: 'up'
    },
    {
      title: 'Inactive Profiles',
      value: '0',
      change: 0,
      icon: this.faUsers,
      color: 'bg-yellow-500',
      trend: 'down'
    },
    {
      title: 'Total Revenue Monthly',
      value: '$ 0',
      change: 0,
      icon: this.faDollarSign,
      color: 'bg-purple-500',
      trend: 'up'
    }
  ]);

  loading = signal(true);

  // Quick Actions
  quickActions = [
    { name: 'Add User', icon: this.faUserPlus, link: '/users/add' },
    { name: 'Create Report', icon: this.faFileAlt, link: '/reports/new' },
    { name: 'View Analytics', icon: this.faChartBar, link: '/analytics' },
    { name: 'Settings', icon: this.faCog, link: '/settings' }
  ];

  constructor(private dashboardService: DashboardService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loading.set(true);
    
    this.dashboardService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats.set([
          {
            title: 'Registered Users',
            value: data.totalUsers.toString(),
            change: 0,
            icon: this.faUsers,
            color: 'bg-blue-500',
            trend: 'up'
          },
          {
            title: 'Active Subscribers',
            value: data.activeSubscriptions.toString(),
            change: 0,
            icon: this.faUsers,
            color: 'bg-green-500',
            trend: 'up'
          },
          {
            title: 'Inactive Profiles',
            value: data.inactiveUsers.toString(),
            change: 0,
            icon: this.faUsers,
            color: 'bg-yellow-500',
            trend: 'down'
          },
          {
            title: 'Total Revenue Monthly',
            value: `$ ${data.totalRevenue.toFixed(2)}`,
            change: 0,
            icon: this.faDollarSign,
            color: 'bg-purple-500',
            trend: 'up'
          },
          {
            title: 'Total Countries',
            value: data.totalCountries.toString(),
            change: 0,
            icon: this.faGlobe,
            color: 'bg-indigo-500',
            trend: 'up'
          },
          {
            title: 'Total Languages',
            value: data.totalLanguages.toString(),
            change: 0,
            icon: this.faLanguage,
            color: 'bg-pink-500',
            trend: 'up'
          }
        ]);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.loading.set(false);
      }
    });
  }

}
