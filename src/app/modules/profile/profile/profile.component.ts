import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { User } from '../../../classes/user';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from '../../../services/app.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  form: FormGroup;
  submitted = false;
  closeResult = '';
  user: User;

  languages: any;

  constructor(
    private translate: TranslateService,
    private userService: UserService,
    private appService: AppService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.user =  this.userService.userValues;

    if (this.user.avatar === undefined || this.user.avatar === '') {
      this.user.avatar = 'assets/img/default-avatar.png';
    }
    const organisations = this.user.organisations.map(e => {
      return e.name;
    });
    this.form = this.formBuilder.group({
      lastName: [this.user.lastName, Validators.required],
      firstName: [this.user.firstName],
      email: [this.user.email, Validators.required],
      organisations: [organisations.join(', ')],
      position: [this.user.position],
      teamService: [this.user.teamService]
    });

    this.languages = this.appService.langList;
  }

  get f() {
    return this.form.controls;
  }

  submit(): void {
    console.log(this.form.getRawValue());
  }

  updateLang(e: any): void {
   if (this.appService.isSupportedLanguage(e.value)) {
     this.translate.setDefaultLang(e.value);
    }
  }

  /****** remove picture ******/
  removePic(): void {
    this.user = { ...this.user, avatar: 'assets/img/default-avatar.png'};
  }

  /****** Avatar image change ******/
  changeAvatar(avatarUpload: any): void {
    const file: File = avatarUpload.files[0];
    const reader = new FileReader();
    const img = new Image();
    img.src = window.URL.createObjectURL(file);
    reader.addEventListener('load', (event: any) => {
          this.user = { ...this.user, avatar: event.target.result};
    });
    reader.readAsDataURL(file);
  }

  /****** save password ******/
  savePassword(passwordVal: any): void {
    this.modalService.dismissAll('modal close');
    this.user = {...this.user};
  }

  /****** open modal ******/
  openModal(content): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  /****** modal close ******/
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
