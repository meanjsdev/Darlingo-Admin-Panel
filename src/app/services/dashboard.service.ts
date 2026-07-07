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
      subscriptionStats: this.subscriptionService.getUserSubscriptionStats(),
      countries: this.countriesLanguagesService.getCountries(),
      languages: this.countriesLanguagesService.getLanguages()
    }).pipe(
      map(({ userStats, subscriptionStats, countries, languages }) => {
        const users = userStats.data.stats;
        // Real purchase data from the UserSubscription collection:
        // revenue from subscriptions bought in the current month and
        // the count of users holding a currently active subscription
        const subStats = subscriptionStats.data;

        return {
          totalUsers: users.totalUsers || 0,
          activeUsers: users.totalActiveUsers || 0,
          inactiveUsers: users.totalInactiveUsers || 0,
          totalRevenue: subStats?.monthlyRevenue || 0,
          activeSubscriptions: subStats?.activeSubscribers || 0,
          totalCountries: countries.length || 0,
          totalLanguages: languages.length || 0
        };
      })
    );
  }
}