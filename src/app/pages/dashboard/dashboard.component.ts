import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BaseChartDirective } from 'ng2-charts';
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
  faCog
} from '@fortawesome/free-solid-svg-icons';

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
    FormsModule,
    BaseChartDirective
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

  // Stats
  stats: StatCard[] = [
    {
      title: 'Registered Users',
      value: '290',
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
  ];

  // Chart types
  planRevenueChartType: 'bar' | 'line' | 'pie' | 'doughnut' = 'bar';
  planSubscriptionChartType: 'bar' | 'line' | 'pie' | 'doughnut' = 'bar';
  chartTypes: ('bar' | 'line' | 'pie' | 'doughnut')[] = ['bar', 'line', 'pie', 'doughnut'];

  // Plan Revenue Data
  planRevenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      }
    ]
  };

  // Plan Subscription Data
  planSubscriptionData = {
    labels: ['Basic', 'Standard', 'Premium'],
    datasets: [
      {
        label: 'Subscriptions',
        data: [0, 0, 0],
        backgroundColor: [
          'rgba(59, 130, 246, 0.5)',
          'rgba(16, 185, 129, 0.5)',
          'rgba(139, 92, 246, 0.5)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(139, 92, 246)'
        ],
        borderWidth: 1
      }
    ]
  };

  // Chart options
  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: '',
        font: {
          size: 14
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false
        },
        ticks: {
          callback: function(value: any) {
            return '$' + value;
          },
          stepSize: 1000
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  // Recent Activities
  activities: Activity[] = [
    {
      id: 1,
      user: 'John Doe',
      action: 'Updated user profile',
      time: '2 min ago',
      avatar: 'JD',
      status: 'completed'
    },
    {
      id: 2,
      user: 'Jane Smith',
      action: 'Added new content',
      time: '10 min ago',
      avatar: 'JS',
      status: 'completed'
    },
    {
      id: 3,
      user: 'Robert Johnson',
      action: 'Deleted user account',
      time: '1 hour ago',
      avatar: 'RJ',
      status: 'pending'
    },
    {
      id: 4,
      user: 'Emily Davis',
      action: 'Changed permissions',
      time: '3 hours ago',
      avatar: 'ED',
      status: 'completed'
    },
    {
      id: 5,
      user: 'Michael Brown',
      action: 'System update failed',
      time: '5 hours ago',
      avatar: 'MB',
      status: 'failed'
    }
  ];

  // Projects
  projects: Project[] = [
    {
      id: 1,
      name: 'User Management System',
      progress: 75,
      status: 'on-track',
      team: ['JD', 'MB', 'ED'],
      deadline: '2023-12-15'
    },
    {
      id: 2,
      name: 'Content Management',
      progress: 90,
      status: 'on-track',
      team: ['JS', 'RJ'],
      deadline: '2023-11-30'
    },
    {
      id: 3,
      name: 'API Integration',
      progress: 45,
      status: 'delayed',
      team: ['MB', 'ED'],
      deadline: '2023-12-10'
    }
  ];

  // Quick Actions
  quickActions = [
    { name: 'Add User', icon: this.faUserPlus, link: '/users/add' },
    { name: 'Create Report', icon: this.faFileAlt, link: '/reports/new' },
    { name: 'View Analytics', icon: this.faChartBar, link: '/analytics' },
    { name: 'Settings', icon: this.faCog, link: '/settings' }
  ];

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.initCharts();
  }

  private initCharts(): void {
    // Line Chart
    const lineCtx = document.getElementById('lineChart') as HTMLCanvasElement;
    if (lineCtx) {
      new Chart(lineCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          datasets: [{
            label: 'Users',
            data: [65, 59, 80, 81, 56, 55, 40],
            borderColor: 'rgb(59, 130, 246)',
            tension: 0.4,
            fill: true,
            backgroundColor: 'rgba(59, 130, 246, 0.1)'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                display: false
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    }

    // Doughnut Chart
    const doughnutCtx = document.getElementById('doughnutChart') as HTMLCanvasElement;
    if (doughnutCtx) {
      new Chart(doughnutCtx, {
        type: 'doughnut',
        data: {
          labels: ['Active', 'Inactive', 'Suspended'],
          datasets: [{
            data: [300, 50, 100],
            backgroundColor: [
              'rgb(59, 130, 246)',
              'rgb(156, 163, 175)',
              'rgb(239, 68, 68)'
            ],
            borderWidth: 0,
            offset: 5
          }]
        },
        options: {
          responsive: true,
          cutout: '70%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                usePointStyle: true,
                pointStyle: 'circle',
                padding: 20
              }
            }
          }
        }
      });
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'on-track':
        return 'bg-green-100 text-green-800';
      case 'delayed':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
}
