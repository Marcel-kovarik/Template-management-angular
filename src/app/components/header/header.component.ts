import { Component, OnInit, Output, EventEmitter, Renderer2, Input } from '@angular/core';
import { Router, NavigationStart, ActivatedRoute, NavigationEnd } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../classes/user';
import { AppService } from '../../services/app.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() showMobileMenuFunc: EventEmitter<any> = new EventEmitter();
  @Input() personalInfo: User;

  logoutState = false;
  internal = false;
  isDropDownMenu = false;

  languages: any;

  listenerFn: () => void;


  constructor(
    private translate: TranslateService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private renderer: Renderer2,
    private userService: UserService,
    private appService: AppService
  ) {
    // Check if displayed route is login page
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        if ((event.url === '/login')) {
          this.logoutState = true;
        } else {
          this.logoutState = false;
        }
      }
    });
  }

  ngOnInit(): void {
    /****** format edit popup close with click ******/
    this.listenerFn = this.renderer.listen(document, 'click', (event) => {
      if (!event.target.closest('.user-avatar')) {
        this.isDropDownMenu = false;
      }
    });
    if (this.appService.isInternalUrl(window.location.hostname)) {
      this.internal = true;
    }
    this.languages = this.appService.langList.filter( e => e.code === 'en' || e.code === 'fr');
  }

  /****** show menu ******/
  showMenu(): void {
    this.showMobileMenuFunc.emit(true);
  }

  /****** Logout function ******/
  logout(): void {
    this.userService.logout();
    this.router.navigate(['login']).then();
  }

  /****** show or hid dropdownmenu ******/
  showDropDownMenu(): void {
    this.isDropDownMenu = !this.isDropDownMenu;
  }

  /****** go to edit profile page ******/
  editProfile(): void {
    this.router.navigate(['profile']).then();
  }

  updateLang(e: any): void {
    if (this.appService.isSupportedLanguage(e.value)) {
      this.translate.setDefaultLang(e.value);
    }
    this.isDropDownMenu = false;
  }
}
