import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../../services/user.service';
import {User} from '../../../../classes/user';
import {TranslateService} from '@ngx-translate/core';
import {AlertService} from '../../../../services/alert.service';
import {Router} from '@angular/router';
import {ServerState} from '../../../../classes/server-state';
import { DialogService } from '../../../../services/dialog.service';
import { PersistenceService } from '../../../../services/persistence.service';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  openActionListId: any = false;

  constructor(private userService: UserService,
              private translate: TranslateService,
              private dialogService: DialogService,
              private alertService: AlertService,
              private persistenceService: PersistenceService,
              private router: Router
  ) {
  }

  users: User[] = [];

  ngOnInit(): void {
    this.getUserList();
  }

  deleteUser(element: any): void {
    const user = element as unknown as User;
    this.dialogService.confirm(this.translate.instant('CONFIRM.DELETE_USER'))
      .then(resp => {
        if (resp) {
          this.userService.deleteUserById(user.id).subscribe(response => {
            const serverState = response as unknown as ServerState;
            if (serverState.ok === true) {
              this.alertService.success(this.translate.instant('ALERTS.USER_DELETE'), {autoClose: true});
              this.getUserList();
            } else {
              this.alertService.error(this.translate.instant('ALERTS.USER_DELETE_FAIL'), {autoClose: true});
            }
          });
        }
      })
      .catch(() => {
        this.alertService.error(this.translate.instant('ALERTS.USER_DELETE_FAIL'));
      });
  }

  newUser(): void {
    this.router.navigate(['admin/user/create']).then();
  }

  editUser(element: any): void {
    this.userService.userModified = element as unknown as User;
    this.persistenceService.setItem('userModified', (element as unknown as User).id.toString());
    this.router.navigate(['admin/user/edit']).then();
  }

  openActionList(id: number): void {
    this.openActionListId = this.openActionListId ? false : id;
  }

  private getUserList(): void {
    this.userService.getAllUsers().subscribe(users => {
      this.users = users;
    });
  }
}
