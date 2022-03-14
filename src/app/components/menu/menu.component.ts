import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {UserService} from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  @Output() showMobileMenuFunc: EventEmitter<any> = new EventEmitter();
  @Input() isMobile: boolean;

  menuId = 'sidebar';
  menuList = [
    {url: '/campaigns/list', ariaLabel: 'ARIA_LABEL.MENU.CAMPAIGNS', icon: 'icon-publish', text: 'CAMPAIGNS', display: true},
    {url: '', ariaLabel: 'ARIA_LABEL.MENU.STATS', icon: 'icon-stats', text: 'STATS', display: false},
    {url: '', ariaLabel: 'ARIA_LABEL.MENU.DISTRIBUTION', icon: 'icon-campaign', text: 'DISTRIBUTION', display: false},
    {url: '/rgpd', ariaLabel: 'ARIA_LABEL.MENU.RGPD', icon: 'icon-rgpd', text: 'RGPD.MAIN_TITLE', display: true},
    {url: '', ariaLabel: 'ARIA_LABEL.MENU.MODERATION', icon: 'icon-comments', text: 'MODERATION', display: false},
    {url: '', ariaLabel: 'ARIA_LABEL.MENU.TEAM', icon: 'icon-team', text: 'TEAM', display: false},
    {url: '', ariaLabel: 'ARIA_LABEL.MENU.SETTINGS', icon: 'icon-settings', text: 'SETTINGS', display: false},
    {url: '', ariaLabel: 'ARIA_LABEL.MENU.SAMPLES', icon: 'icon-question', text: 'SAMPLES', display: false}
  ];

  constructor(
    private router: Router,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.menuId = this.isMobile ? 'mobileSidebar' : 'sidebar';

    this.userService.user.subscribe(user => {
      this.menuList.push(
        {url: '/admin/user', ariaLabel: 'ARIA_LABEL.MENU.USERS', icon: 'icon-profil', text: 'USERS', display: user.userType === 'INTERNE'}
      );
      this.menuList.push(
        {
          url: '/admin/organisation',
          ariaLabel: 'ARIA_LABEL.MENU.ORGANISATION',
          icon: 'icon-arbo',
          text: 'ORGANISATIONS',
          display: user.userType === 'INTERNE'
        }
      );
    }).unsubscribe();
  }

  hideMenu(): void {
    if (this.isMobile) {
      this.showMobileMenuFunc.emit(false);
    }
  }

  logout(): void {
    this.hideMenu();
    this.userService.logout();
    this.router.navigate(['login']).then();
  }

}
