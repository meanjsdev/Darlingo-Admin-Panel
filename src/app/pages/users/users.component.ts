import { Component, HostListener, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

// Models and Services
import { User, UserStatus } from '../../models/user.model';
import { UserService, type UserQueryParams, type UserListResponse } from '../../services/user.service';

type FilterOption = {
  label: string;
  value: string | null;
};

type ToastMessage = {
  text: string;
  type: 'success' | 'error';
};

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class UsersComponent {
  // Services
  private userService = inject(UserService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  // Signals for state management
  users = signal<User[]>([]);
  loading = signal(true);
  deleting = signal(false);
  showDeleteConfirm = signal(false);
  userToDelete = signal<User | null>(null);
  toastMessage = signal<ToastMessage | null>(null);
  
  // Dropdown states
  isStatusDropdownOpen = signal(false);
  isRoleDropdownOpen = signal(false);
  
  // Pagination
  currentPage = signal(1);
  itemsPerPage = 10;
  itemsPerPageOptions = [5, 10, 20, 50];
  totalRecords = signal(0);
  totalPages = computed(() => Math.ceil(this.totalRecords() / this.itemsPerPage));
  
  // Filters
  searchTerm = signal('');
  statusFilter = signal<FilterOption | null>({ label: 'All Status', value: null });
  roleFilter = signal<FilterOption | null>({ label: 'All Roles', value: null });
  
  // Filter options
  statusOptions = signal<FilterOption[]>([
    { label: 'All Status', value: null },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ]);

  roleOptions = signal<FilterOption[]>([
    { label: 'All Roles', value: null },
    { label: 'Admin', value: 'admin' },
    { label: 'User', value: 'user' },
  ]);

  constructor() {
    // Load users when component initializes
    this.loadUsers();
    
    // Auto-hide toast after 5 seconds
    effect(() => {
      if (this.toastMessage()) {
        const timer = setTimeout(() => {
          this.clearToast();
        }, 5000);
        return () => clearTimeout(timer);
      }
      return undefined;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Data loading
  loadUsers(): void {
    this.loading.set(true);
    
    const params: UserQueryParams = {
      page: this.currentPage(),
      limit: this.itemsPerPage,
      search: this.searchTerm() || undefined,
      status: this.statusFilter()?.value as UserStatus || undefined,
      role: this.roleFilter()?.value as string || undefined
    };

    this.userService.getUsers(params)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (response) => {
          this.users.set(response.data?.users || []);
          this.totalRecords.set(response.data?.total || 0);
        },
        error: (error) => {
          console.error('Error loading users:', error);
          this.showToast('Failed to load users', 'error');
        }
      });
  }

  // Filter methods
  applyFilters(): void {
    this.currentPage.set(1);
    this.loadUsers();
  }

  resetFilters(): void {
    this.searchTerm.set('');
    this.statusFilter.set(null);
    this.roleFilter.set(null);
    this.currentPage.set(1);
    this.closeAllDropdowns();
    this.loadUsers();
  }

  setStatusFilter(status: { value: string | null; label: string }): void {
    this.statusFilter.set(status);
    this.currentPage.set(1);
    this.closeAllDropdowns();
  }

  setRoleFilter(role: { value: string | null; label: string }): void {
    this.roleFilter.set(role);
    this.currentPage.set(1);
    this.closeAllDropdowns();
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown') && !target.closest('.dropdown-menu')) {
      this.closeAllDropdowns();
    }
  }

  // Toggle dropdowns
  toggleStatusDropdown(event: Event) {
    event.stopPropagation();
    this.isStatusDropdownOpen.update(prev => !prev);
    if (this.isStatusDropdownOpen()) {
      this.isRoleDropdownOpen.set(false);
    }
  }

  toggleRoleDropdown(event: Event) {
    event.stopPropagation();
    this.isRoleDropdownOpen.update(prev => !prev);
    if (this.isRoleDropdownOpen()) {
      this.isStatusDropdownOpen.set(false);
    }
  }

  // Close all dropdowns
  closeAllDropdowns() {
    this.isStatusDropdownOpen.set(false);
    this.isRoleDropdownOpen.set(false);
  }

  // Pagination methods
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadUsers();
    }
  }

  changeItemsPerPage(items: number): void {
    this.itemsPerPage = items;
    this.currentPage.set(1);
    this.loadUsers();
  }

  getPaginationRange(): number[] {
    const range: number[] = [];
    const maxVisiblePages = 5;
    let start = Math.max(1, this.currentPage() - Math.floor(maxVisiblePages / 2));
    let end = Math.min(this.totalPages(), start + maxVisiblePages - 1);
    
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    
    return range;
  }

  // User actions
  toggleUserStatus(user: User, event: Event): void {
    event.stopPropagation();
    if (!user?._id) return;
    
    const newStatus: UserStatus = user.accountStatus === 'active' ? 'inactive' : 'active';
    
    this.userService.updateUserStatus(user._id, newStatus === 'active')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.users.update(users => 
            users.map(u => 
              u._id === user._id ? { ...u, accountStatus: newStatus } : u
            )
          );
          this.showToast(`User ${newStatus} successfully`, 'success');
        },
        error: (error) => {
          console.error('Error updating user status:', error);
          this.showToast('Failed to update user status', 'error');
        }
      });
  }

  viewUser(user: User): void {
    if (user?._id) {
      this.router.navigate(['/users', user._id]);
    }
  }

  editUser(user: User): void {
    if (user?._id) {
      this.router.navigate(['/users', user._id, 'edit']);
    }
  }

  addUser(): void {
    this.router.navigate(['/users/new']);
  }

  confirmDelete(user: User): void {
    this.userToDelete.set(user);
    this.showDeleteConfirm.set(true);
  }

  onDeleteConfirm(confirmed: boolean): void {
    this.showDeleteConfirm.set(false);
    
    const userToDelete = this.userToDelete();
    if (confirmed && userToDelete?._id) {
      this.deleting.set(true);
      this.userService.deleteUser(userToDelete._id)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => this.deleting.set(false))
        )
        .subscribe({
          next: () => {
            this.users.update(users => users.filter(u => u._id !== userToDelete._id));
            this.showToast('User deleted successfully', 'success');
            this.userToDelete.set(null);
          },
          error: (error) => {
            console.error('Error deleting user:', error);
            this.showToast('Failed to delete user', 'error');
          }
        });
    }
  }

  // UI Helpers
  showToast(text: string, type: 'success' | 'error'): void {
    if (text) {
      this.toastMessage.set({ text, type });
    }
  }

  clearToast(): void {
    this.toastMessage.set(null);
  }
}