import { Component, OnInit, Renderer2 } from '@angular/core';
import { LegalDocument } from '../../../classes/legal-document';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewDocumentComponent } from '../../../components/new-document/new-document.component';
import { LegalService } from '../../../services/legal.service';
import { Router } from '@angular/router';
import { DialogService } from '../../../services/dialog.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-rgpd',
  templateUrl: './rgpd.component.html',
  styleUrls: ['./rgpd.component.scss']
})
export class RgpdComponent implements OnInit {

  legalDocuments: LegalDocument[] = [];
  isLoaded = false;
  displayAction: number;
  listenerFn: () => void;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private legalService: LegalService,
    private renderer: Renderer2,
    private dialogService: DialogService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {

    this._loadDocuments();

    // Add listener to close app-action if open
    this.listenerFn = this.renderer.listen(document, 'click', (event) => {
      if (!event.target.closest('.card-action-btn')) {
        this.displayAction = 0;
      }
    });
  }

  edit(id: number): void {
    this.router.navigate([`/rgpd/generator/${id}`]).then();
  }

  delete(id: number): void {
    this.dialogService.confirm(this.translate.instant('CONFIRM.DELETE_DOCUMENT'))
      .then(response => {
        if (response) {
          this.legalService.deleteDocument(id).subscribe(rst => {
            this._loadDocuments();
          });
        }
      })
      .catch();

  }

  display(id: number): void {
    this.displayAction = id;
  }

  openModal(): void {
    const ref = this.modalService.open(NewDocumentComponent, { ariaLabelledBy: 'modal-basic-title' });
    ref.componentInstance.onSubmitAction.subscribe( result => {
      this.isLoaded = false;
      this._loadDocuments();
      if (result.source === 'GENERATED') {
        this.router.navigate([`/rgpd/generator/${result.id}`]);
      }
    });
  }

  private _loadDocuments(): void {
    this.legalService.getAll().subscribe(documents => {
      this.legalDocuments = documents;
      this.isLoaded = true;
    });
  }

}
