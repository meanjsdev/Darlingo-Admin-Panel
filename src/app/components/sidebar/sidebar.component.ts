import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faHome, 
  faUsers, 
  faList, 
  faCog, 
  faSignOutAlt, 
  faChevronDown, 
  faChevronRight,
  faUserCircle
} from '@fortawesome/free-solid-svg-icons';

interface MenuItem {
  title: string;
  icon: any;
  route: string;
  exact?: boolean;
  children?: MenuItem[];
  isExpanded?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  // Icons
  faHome = faHome;
  faUsers = faUsers;
  faList = faList;
  faCog = faCog;
  faSignOut = faSignOutAlt;
  faChevronDown = faChevronDown;
  faChevronRight = faChevronRight;
  faUser = faUserCircle;

  // Menu items
  menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      icon: this.faHome,
      route: '/dashboard',
      exact: true
    },
    {
      title: 'Users',
      icon: this.faUsers,
      route: '/users'
    },
    {
      title: 'Manage Content',
      icon: this.faList,
      route: '/content',
      children: [
        { title: 'Sexual Orientation', icon: this.faList, route: '/content/sexual-orientation' },
        { title: 'Looking For', icon: this.faList, route: '/content/looking-for' },
        { title: 'Education', icon: this.faList, route: '/content/education' },
        { title: 'Workout', icon: this.faList, route: '/content/workout' },
        { title: 'Religion', icon: this.faList, route: '/content/religion' },
        { title: 'Smoking', icon: this.faList, route: '/content/smoking' },
        { title: 'Drinking', icon: this.faList, route: '/content/drinking' },
        { title: 'Interests', icon: this.faList, route: '/content/interests' }
      ],
      isExpanded: false
    },
    {
      title: 'Settings',
      icon: this.faCog,
      route: '/settings'
    }
  ];

  // User info
  currentUser = {
    name: 'Admin User',
    role: 'Administrator',
    avatar: ''
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Initialize expanded state based on current route
    this.updateMenuExpansion();
    
    // Subscribe to route changes
    this.router.events.subscribe(() => {
      this.updateMenuExpansion();
    });
  }

  toggleSubMenu(menuItem: MenuItem): void {
    if (menuItem.children) {
      menuItem.isExpanded = !menuItem.isExpanded;
    }
  }

  private updateMenuExpansion(): void {
    const currentRoute = this.router.url;
    this.menuItems.forEach(item => {
      if (item.children) {
        item.isExpanded = item.children.some(child => 
          currentRoute.startsWith(child.route)
        );
      }
    });
  }

  onLogout(): void {
    // Implement logout logic here
    console.log('Logging out...');
  }
}
