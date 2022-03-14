import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Campaign } from '../../../../classes/campaign';
import { Creation } from '../../../../classes/creation';
import { FormatItemsType } from '../../../../interfaces/format-items-type';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CampaignService } from '../../../../services/campaign.service';
import { CreationService } from '../../../../services/creation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Crumb } from '../../../../interfaces/crumb';
import { FormatService } from '../../../../services/format.service';
import { Format } from '../../../../classes/format';
import { AlertService } from '../../../../services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { FormatTypePipe } from '../../../../pipes/format-type.pipe';
import { PersistenceService } from '../../../../services/persistence.service';
import { ConversationService } from '../../../../services/conversation.service';
import { Language } from '../../../../classes/language';
import { Conversation } from '../../../../classes/conversation';
import { TranslateParamsPipe } from '../../../../pipes/translate-params.pipe';
import { StatesService } from '../../../../services/states.service';
import { DialogService } from '../../../../services/dialog.service';
import { NewConversationComponent } from '../../../../components/new-conversation/new-conversation.component';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  providers: [TranslateParamsPipe]
})
export class EditComponent implements OnInit, OnDestroy {

  editing = false;
  loading = true;
  linking = false;
  crumbs: Crumb[] = [];
  conversationInProgress = false;
  conversationReady = false;
  conversationPublished = false;

  closeResult = '';
  listenerFn: () => void;

  title: string;
  formatEditOpen: any;
  campaign: Campaign;
  creation: Creation;
  formats: Format[] = [];
  languages: Language[] = [];
  conversationList: Conversation[] = [];
  formatItems: FormatItemsType[] = [];

  creationName = new FormControl();
  conversationForm: FormGroup;
  conversationListForm: FormGroup;

  constructor(
    public stateService: StatesService,
    private modalService: NgbModal,
    private campaignService: CampaignService,
    private creationService: CreationService,
    private persistenceService: PersistenceService,
    private formatService: FormatService,
    private alertService: AlertService,
    private dialogService: DialogService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private renderer: Renderer2,
    private translate: TranslateService,
    private formatTypePipe: FormatTypePipe,
    private translateParamsPipe: TranslateParamsPipe,
    private conversationService: ConversationService
  ) {
    this.conversationForm = this.formBuilder.group({
      name: ['', Validators.required],
      languageCode: ['', Validators.required],
      conversationType: ['CREA']
    });
    this.conversationListForm = this.formBuilder.group({
      conversationId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Get datas
    this.creation = this.creationService.getCurrentCreation();
    this.campaign = this.campaignService.getCurrentCampaign();

    // Redirect if no creation is defined
    if (this.creation === undefined) {
      this.router.navigate(['campaigns/list']).then();
      return;
    }

    // Always update current creation
    this.creationService.getCreationById(this.creation.id).subscribe(creation => {
      this.creation = this.creationService.getCurrentCreation();
      // Set default form value (name), create breadcrumbs
      this.creationName.setValue(this.creation.name);
      this._makeCrumbs(this.campaign.name);
      if (this.creation.conversation) {
        this._setConversationStates(this.creation.conversation.state);
      }

      // Manage conversation (get latest version)
      this._manageConversation(this._loadFormats());

      /****** format edit popup close with click ******/
      this.listenerFn = this.renderer.listen(document, 'click', (event) => {
        if (!event.target.closest('.card-action-btn')) {
          this.formatEditOpen = false;

          this.formatItems.forEach(item => {
            item.isEdit = false;
          });
        }
      });
    });

  }

  ngOnDestroy(): void {
    if (this.listenerFn) {
      this.listenerFn();
    }
  }

  /****** redirect to format page ******/
  goFormatList(): void {
    this.router.navigate(['campaigns/formats/list']).then();
  }

  /****** Open format edit ******/
  openEdit(id: any): void {
    this.formatEditOpen = !this.formatEditOpen ? id : false;
  }

  /**
   * Edit conversation (send user to conversation with current conversation loaded)
   */
  editConversation(): void {
    if (this.conversationService.getCurrentConversation()) {
      this.router.navigate(['conversation/editor']).then();
      return;
    }
    this.alertService.error(this.translate.instant('CONVERSATION.PLEASE_SELECT'), {autoClose: true});
  }

  /**
   * Edit conversation (send user to conversation with current conversation loaded)
   */
  deleteConversation(): void {
    // set conversation key to null (for display)
    this.creation.conversation = null;
    // unlink in database
    this.creationService.linkConversation(null, this.creation.id).subscribe( response => {
      if (!response.ok) {
        this.alertService.error(this.translate.instant('CONVERSATION.UNLINK_ERROR'));
        return;
      }
      // Display success message and reset conversationService current values
      this.alertService.success(this.translate.instant('CONVERSATION.UNLINKED'), {autoClose: true});
      this.creationService.updateCurrentCreation();
      this.conversationService.reset();
      this._manageConversation();
    });
  }

  /**
   * Edit format (passed to app-action component)
   * @param id number
   */
  edit(id: number): void {
    const format = this.formats.filter(e => {
      return e.id === id;
    });
    this.formatService.setCurrentFormat(format[0]);
    this.router.navigate([this.formatTypePipe.transform(format[0].formatSpec.code, 'route')]).then();
  }

  /**
   * Delete format (passed to app-action component)
   * @param id number
   */
  delete(id: number): void {
    this.dialogService.confirm(this.translate.instant('CONFIRM.DELETE_FORMAT'))
      .then( confirm => {
        if (confirm) {
          this.formatService.delete(id).subscribe( resp => {
            if (resp.ok === true) {
              this.alertService.success(this.translate.instant('ALERTS.DELETE_FORMAT_SUCCEED'), {autoClose: true});
              this.creationService.updateCurrentCreation();
              this._loadFormats();
            } else {
              this.alertService.error(this.translate.instant('ALERTS.DELETE_FORMAT_FAILED'));
            }
          });
        }
      })
      .catch();
  }

  focusIn(): void {
    this.editing = true;
  }

  closeOrUpdate(close): void {
    if (!close) {
      // Update creation name
      this.creationService.update({name: this.creationName.value, id: this.creation.id})
        .subscribe( creation => {
          if (creation) {
            this._makeCrumbs(creation.name);
            this.campaignService.updateCurrentCampaign();
            this.alertService.success(this.translate.instant('ALERTS.CREATION_UPDATED'), {autoClose: true});
          } else {
            this.alertService.error(this.translate.instant('ALERTS.CREATION_UPDATE_FAIL'));
          }
        });
    } else {
      this.creationName.setValue(this.creation.name);
    }
    this.editing = false;
  }

  openConversationModal(): void {
    const modalRef = this.modalService.open(NewConversationComponent, { ariaLabelledBy: 'modal-basic-title' });
    modalRef.componentInstance.conversationState.subscribe(state => {
      this._setConversationStates(state);
    });
    modalRef.componentInstance.linkingState.subscribe(linking => {
      this.linking = linking;
    });
  }

  selectConversation(event): void {
    this.linking = true;
    const currentConversation = this.conversationList.filter(e => e.id === parseInt(event.target.value, 10));
    this.conversationService.setCurrentConversation(currentConversation[0]);
    this._linkConversation(currentConversation[0]);
  }

  /****** open modal ******/
  openModal(content): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this._getDismissReason(reason)}`;
    });
  }

  /**
   * Return Format state to be translated & displayed
   * @param state number
   */
  getFormatStates(state: number): string {
    if (this.stateService.hasReady(state)) {
      if (this.stateService.hasPublished(state)) {
        if (this.stateService.hasUpdated(state)) {
          return 'UPDATED';
        }
        return 'PUBLISHED';
      }
      return 'READY';
    }
    return 'IN_PROGRESS';
  }

  copyTag(e): void {
    e.target.classList = 'icon-sent';
    e.target.title = this.translate.instant('COPIED');
    setTimeout(() => {
      e.target.classList = 'icon-list';
      e.target.title = this.translate.instant('CLIPBOARD_COPY');
    }, 2000);
  }

  /****** close modal ******/
  private _getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  private _linkConversation(conversation: Conversation, next?: () => any): void {
    this.creationService.linkConversation(conversation.id, this.creation.id).subscribe( response => {
      if (!response.ok) {
        const errorMessage = this.translate.instant('CONVERSATION.LINK_ERROR');
        this.alertService.error(this.translateParamsPipe.transform(errorMessage, {name: conversation.name}));
        this.linking = false;
        return;
      }
      // Set latest version and redirect to conversation
      this.conversationService.getLatestVersionOfConversation().subscribe(flow => {
        this._updateCreationValues(() => { this.linking = false; });
        if (next) {
          next();
        }
      });
    });
  }

  private _updateCreationValues(next?: () => void): void {
    // Update creation object with full values
    this.creationService.getCreationById(this.creation.id).subscribe(creation => {
      this.creation = creation;
      if (this.creation.conversation) {
        this._setConversationStates(creation.conversation.state);
      }
      if (next) { next(); }
    });
  }

  private _setConversationStates(state: number): void {
    this.conversationInProgress = this.stateService.hasInProgress(state);
    this.conversationPublished = (this.stateService.hasPublished(state) && !this.stateService.hasReady(state));
    this.conversationReady = this.stateService.hasReady(state);
  }

  private _manageConversation(next?: () => void): any {
    // if a conversation is linked to the creation we need to defined it as default in service
    if (this.creation.conversation) {
      this.conversationService.getConversationById(this.creation.conversation.id).subscribe(conversation => {
        this.conversationService.getLatestVersionOfConversation().subscribe(latest => {
          // if other actions to be performed after
          if (next) { next(); }
        });
      });
    }
    // Parallel configurations
    // Get all conversations available
    this.conversationService.getAllUnlinkedConversations().subscribe(conversationList => {
      this.conversationList = conversationList;
    });
    // Get all language available for this type of creation
    this.conversationService.getAvailableLanguage(this.creation.creationType).subscribe(languages => {
      this.languages = languages;
    });
  }

  private _loadFormats(): any {
    this.formatService.getAllFormatsByCreationId(this.creation.id).subscribe(formats => {
      this.formats = formats;
      // Check current creation state to warn or validate
      const state = this.creationService.getState();
      if (!state) {
        this.alertService.warn(this.translate.instant('CREATION.STATE_ERROR'));
        this.stateService.state = 2;
      } else {
        this.stateService.state = state;
      }

      this.loading = false;
    });
  }

  private _makeCrumbs(campaignName: string): void {
    this.crumbs = [
      {route: '/campaigns/edit', text: this.campaign.name},
      {route: '', text: campaignName + ' <small>(Ads)</small>'}
    ];
  }
}
