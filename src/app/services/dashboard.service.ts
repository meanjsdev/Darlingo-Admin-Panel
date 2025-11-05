import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { UserService } from './user.service';
import { SubscriptionService } from './subscription.service';
import { CountriesLanguagesService } from './countries-languages.service';

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalRevenue: number;
  activeSubscriptions: number;
  totalCountries: number;
  totalLanguages: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(
    private userService: UserService,
    private subscriptionService: SubscriptionService,
    private countriesLanguagesService: CountriesLanguagesService
  ) {}

  getDashboardStats(): Observable<DashboardStats> {
    return forkJoin({
      userStats: this.userService.getUserStats(),
      subscriptions: this.subscriptionService.getSubscriptions(),
      countries: this.countriesLanguagesService.getCountries(),
      languages: this.countriesLanguagesService.getLanguages()
    }).pipe(
      map(({ userStats, subscriptions, countries, languages }) => {
        const users = userStats.data.stats;
        const subs = subscriptions.data || [];
        
        // Calculate revenue from active subscriptions
        const totalRevenue = subs
          .filter(sub => sub.isActive)
          .reduce((sum, sub) => sum + (sub.price || 0), 0);

        const activeSubscriptions = subs.filter(sub => sub.isActive).length;

        return {
          totalUsers: users.totalUsers || 0,
          activeUsers: users.totalActiveUsers || 0,
          inactiveUsers: users.totalInactiveUsers || 0,
          totalRevenue,
          activeSubscriptions,
          totalCountries: countries.length || 0,
          totalLanguages: languages.length || 0
        };
      })
    );
  }
}