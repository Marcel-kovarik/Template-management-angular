import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Crumb } from '../../../interfaces/crumb';
import { NewConversationComponent } from '../../../components/new-conversation/new-conversation.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormatService } from '../../../services/format.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  @Output() save = new EventEmitter();
  @Output() publish = new EventEmitter();

  @Input() crumbs: Crumb[] = [];
  @Input() formatId: number;
  @Input() saving = false;
  @Input() editAction: boolean;
  @Input() hasUpdate: boolean;
  @Input() edited: any = [];
  @Input() missingKeys = [];
  @Input() publishing: boolean;

  advancedSettings = false;
  displayErrorContainer = false;
  publishButtonActive = [];

  constructor(
    private formatService: FormatService,
    private location: Location,
    private modalService: NgbModal,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  publishConversation(): void {
    this.publish.emit();
  }

  backClicked(): void {
    this.location.back();
  }

  saveClicked(): void {
    if (this.hasUpdate) {
      this.save.emit();
    }
  }

  toggleSettings(): void {
    this.advancedSettings = !this.advancedSettings;
  }

  hideSettings(): void {
    this.advancedSettings = false;
  }

  displayErrors(display: boolean): void {
    this.displayErrorContainer = display;
  }

  openConversationModal(): void {
    this.modalService.open(NewConversationComponent, { ariaLabelledBy: 'modal-basic-title' });
  }

  goToConversation(): void {
    this.router.navigate(['conversation/editor']);
  }
}
