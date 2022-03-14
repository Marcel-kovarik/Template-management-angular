import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConversationRoutingModule } from './conversation-routing.module';
import { ConvBreadcrumbComponent } from './conv-breadcrumb/conv-breadcrumb.component';
import { NewBuilderComponent } from './new-builder/new-builder.component';
import { SharedModule } from '../shared/shared.module';
import { NodeEditorComponent } from './shared/node-editor/node-editor.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OpenEndedComponent } from './shared/open-ended/open-ended.component';
import { OpenEndedSelectComponent } from './shared/open-ended-select/open-ended-select.component';
import { AnswerEditComponent } from './shared/answer-edit/answer-edit.component';
import { FormatModule } from '../campaign/format/format.module';
import { NodeSectionListComponent } from './shared/node-section-list/node-section-list.component';
import { AdvancedSettingsComponent } from './advanced-settings/advanced-settings.component';
import { AddTextComponent } from './shared/add-text/add-text.component';

@NgModule({
  declarations: [
    ConvBreadcrumbComponent,
    NewBuilderComponent,
    NodeEditorComponent,
    OpenEndedComponent,
    OpenEndedSelectComponent,
    AnswerEditComponent,
    NodeSectionListComponent,
    AdvancedSettingsComponent,
    AddTextComponent
  ],
  imports: [
    CommonModule,
    ConversationRoutingModule,
    SharedModule,
    MatSnackBarModule,
    DragDropModule,
    FormatModule
  ]
})
export class ConversationModule { }
