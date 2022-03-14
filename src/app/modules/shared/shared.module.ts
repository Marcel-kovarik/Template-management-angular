import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { EditCampaignsComponent } from '../../components/edit-campaigns/edit-campaigns.component';
import { NewCampaignComponent } from '../../components/new-campaign/new-campaign.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CreationTypePipe } from '../../pipes/creation-type.pipe';
import { ActionsComponent } from '../../components/actions/actions.component';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';
import { ContenteditableModule } from '@ng-stack/contenteditable';
import { OrderByPipe } from '../../pipes/order-by.pipe';
import { FormatTypePipe } from '../../pipes/format-type.pipe';
import { ChecklistPipe } from '../../pipes/checklist.pipe';
import { TranslateParamsPipe } from '../../pipes/translate-params.pipe';
import { SecToTimePipe } from '../../pipes/sec-to-time.pipe';
import { TriggerActionComponent } from '../../components/trigger-action/trigger-action.component';
import { PreviewComponent } from '../conversation/preview/preview.component';
import { ChatComponent } from '../../components/chat/chat.component';
import { RecorderComponent } from '../../components/recorder/recorder.component';
import { ImageCropperComponent } from '../../components/image-cropper/image-cropper.component';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { QuitWarningGuard } from '../../_guard/quit-warning.guard';
import { NewConversationComponent } from '../../components/new-conversation/new-conversation.component';
import { MaxLengthPipe } from '../../pipes/max-length.pipe';

@NgModule({
  declarations: [
    CreationTypePipe,
    EditCampaignsComponent,
    ActionsComponent,
    NewCampaignComponent,
    NewConversationComponent,
    OrderByPipe,
    FormatTypePipe,
    ChecklistPipe,
    TranslateParamsPipe,
    TriggerActionComponent,
    SecToTimePipe,
    PreviewComponent,
    ChatComponent,
    RecorderComponent,
    ImageCropperComponent,
    ConfirmModalComponent,
    MaxLengthPipe
  ],
  imports: [
    CommonModule,
    ContenteditableModule,
    NgbModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatSnackBarModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    OrderByPipe,
    FormatTypePipe,
    QuitWarningGuard,
    MaxLengthPipe
  ],
  exports: [
    CommonModule,
    ContenteditableModule,
    NgbModule,
    HttpClientModule,
    TranslateModule,
    CreationTypePipe,
    EditCampaignsComponent,
    NewCampaignComponent,
    NewConversationComponent,
    ActionsComponent,
    OrderByPipe,
    FormatTypePipe,
    ChecklistPipe,
    TranslateParamsPipe,
    ReactiveFormsModule,
    SecToTimePipe,
    TriggerActionComponent,
    PreviewComponent,
    ChatComponent,
    RecorderComponent,
    ImageCropperComponent,
    ConfirmModalComponent,
    FormsModule,
    MaxLengthPipe
  ]
})
export class SharedModule { }

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
