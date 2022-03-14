import { Component, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationStart } from '@angular/router';
import * as platform from 'platform';
import { DOCUMENT } from '@angular/common';
import { UserService } from './services/user.service';
import { User } from './classes/user';
import { AppService } from './services/app.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Talk-in';

  user: User;
  showMenubar = true;
  showFooter = true;
  showMobileMenu = false;

  secondaryClass = '';

  // show mobile menu
  showMobileMenuFunc(isShowMenu: boolean): void {
    this.showMobileMenu = isShowMenu;
  }

  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    public translate: TranslateService,
    private appService: AppService,
    private userService: UserService
  ) {

    // Load specific stylesheet for apple desktop
    if (platform.os.family.toLowerCase() === 'os x') {
      this.loadStyle('apple_only');
    }

    // Removing Menubar, Footer for Login page
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {

        if (event.url === '/login' || !this.userService.isConnected()) {
          this.showMenubar = false;
          this.showFooter = false;
          document.querySelector('#content').classList.remove('p-main-container');
          document.querySelector('#content').classList.add('full-page-wrapper');
        } else {
          this.userService.user.subscribe(userValues => {
            this.user = userValues;
          });
          if (event.url.startsWith('/conversation')) {
            this.secondaryClass = 'conversation';
            this.showFooter = false;
          } else {
            this.showMenubar = true;
            this.showFooter = true;
            document.querySelector('#content').classList.add('p-main-container');
            document.querySelector('#content').classList.remove('full-page-wrapper');
          }
        }
      }
    });

    // Translate
    translate.addLangs(this.appService.langCode);
    translate.setDefaultLang('en');

  }

  loadStyle(styleName: string): void {
    const head = this.document.getElementsByTagName('head')[0];
    const style = this.document.createElement('link');
    // style.id = styleName;
    style.rel = 'stylesheet';
    style.href = `assets/css/${styleName}.css`;

    head.appendChild(style);
  }
}
