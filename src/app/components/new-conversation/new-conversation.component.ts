import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ObjectID } from 'bson';
import { ConvFlowPack } from '../../interfaces/convflow-models';
import { ConvConfig } from '../../classes/conversation/conv-config';
import { ConversationService } from '../../services/conversation.service';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Conversation } from '../../classes/conversation';
import { Router } from '@angular/router';
import { CreationService } from '../../services/creation.service';
import { AlertService } from '../../services/alert.service';
import { TranslateParamsPipe } from '../../pipes/translate-params.pipe';
import { Language } from '../../classes/language';
import { Creation } from '../../classes/creation';

@Component({
  selector: 'app-new-conversation',
  templateUrl: './new-conversation.component.html',
  styleUrls: ['./new-conversation.component.scss'],
  providers: [TranslateParamsPipe]
})
export class NewConversationComponent implements OnInit {

  @Output() conversationState = new EventEmitter();
  @Output() linkingState = new EventEmitter();

  creation: Creation;
  conversationForm: FormGroup;
  submitted = false;
  languages: Language[] = [];

  constructor(
    private router: Router,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private creationService: CreationService,
    private conversationService: ConversationService,
    private activeModal: NgbActiveModal,
    private translateParamsPipe: TranslateParamsPipe
  ) { }

  ngOnInit(): void {
    this.conversationForm = this.formBuilder.group({
      name: ['', Validators.required],
      languageCode: ['', Validators.required],
      conversationType: ['CREA']
    });

    this.creation = this.creationService.getCurrentCreation();

    // Get all language available for this type of creation
    this.conversationService.getAvailableLanguage(this.creation.creationType).subscribe(languages => {
      this.languages = languages;
    });
  }

  close(reason): void {
    this.activeModal.dismiss(reason);
  }

  /****** Add new conversation ******/
  conversationAdd(): void {
    this.submitted = true;
    // stop here if form is invalid
    if (this.conversationForm.invalid) {
      return;
    }

    // True if all the fields are filled
    if (this.submitted) {
      const formValues = this.conversationForm.getRawValue();
      this.conversationService.createConversation(formValues).subscribe( conversation => {
        this.conversationService.setCurrentConversation(conversation);
        const firstNode = {
          Name: this.translate.instant('START_NODE'),
          Id: new ObjectID().toHexString(),
          Sections: [],
          Answers: { AnswerList: [] },
          IsStartNode: true,
          IsEndNode: true
        };
        const currentFLow: ConvFlowPack = {
          ConvNodes: [firstNode],
          CreatedOn: new Date(),
          UpdatedOn: new Date(),
          NodeLocations: {},
          ProjectId: conversation.id,
          _id: conversation.id
        };
        currentFLow.NodeLocations[firstNode.Id] = {
          x: 50,
          y: (0 + (ConvConfig.defaultDesignerHeight / 2)) + (Math.random() * 50) - 200
        };
        this.conversationService.createConversationVersion(conversation.id, currentFLow).subscribe(version => {
          this.close('created');
          this._linkConversation(conversation, () => {
            this.router.navigate(['conversation/editor']).then();
          });
        });
      });
    }
  }

  private _linkConversation(conversation: Conversation, next?: () => any): void {
    this.creationService.linkConversation(conversation.id, this.creation.id).subscribe( response => {
      if (!response.ok) {
        const errorMessage = this.translate.instant('CONVERSATION.LINK_ERROR');
        this.alertService.error(this.translateParamsPipe.transform(errorMessage, {name: conversation.name}));
        this.linkingState.emit(false);
        return;
      }
      // Set latest version and redirect to conversation
      this.conversationService.getLatestVersionOfConversation().subscribe(flow => {
        this._updateCreationValues(() => { this.linkingState.emit(false); });
        if (next) {
          next();
        }
      });
    });
  }

  private _updateCreationValues(next?: () => void): void {
    // Update creation object with full values
    this.creationService.getCreationById(this.creation.id).subscribe(creation => {
      if (creation.conversation) {
        this.conversationState.emit(creation.conversation.state);
      }
      if (next) { next(); }
    });
  }

}
