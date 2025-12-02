import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'solutio-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  public currentRoute = '';
  public menuItems = [
    { label: 'Home', route: '/home', icon: 'home' },
  ];

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.currentRoute = event.url;
        }
      });
  }

  public trackByRoute(_index: number, item: { route: string }): string {
    return item.route;
  }

  public getActiveRoute(route: string): string | null {
    const routeWithSlash = `${route}/`;
    const isActive = this.currentRoute === route || this.currentRoute.startsWith(routeWithSlash);
    return isActive ? 'page' : null;
  }
}

