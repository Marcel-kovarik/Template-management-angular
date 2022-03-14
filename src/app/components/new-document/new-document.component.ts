import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Language } from '../../classes/language';
import { ListValue } from '../../classes/list-value';
import { LegalDocument } from '../../classes/legal-document';
import { LegalService } from '../../services/legal.service';

@Component({
  selector: 'app-new-document',
  templateUrl: './new-document.component.html',
  styleUrls: ['./new-document.component.scss']
})
export class NewDocumentComponent implements OnInit {

  @Output() onSubmitAction = new EventEmitter();

  documentForm: FormGroup;
  submitted = false;
  uploaded = false;
  loadingDocument = false;
  document: LegalDocument = new LegalDocument();
  languages: Language[];
  documentType: ListValue[];

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private legalService: LegalService
  ) {}

  ngOnInit(): void {
    // Init form
    this.documentForm = this.formBuilder.group({
      source: [false],
      name: ['', Validators.required],
      file: [''],
      lang: ['', Validators.required],
      docType: ['', this._conditionalRequiredValidator]
    });
    this.f.source.valueChanges.subscribe(e => {
      this.f.docType.updateValueAndValidity();
    });
    // Set language selector values
    this.languages = [
      new Language({name: 'LEGAL.FR', languageCode: 'fr-FR'}),
      new Language({name: 'LEGAL.EN', languageCode: 'en-EN'}),
      new Language({name: 'LEGAL.ES', languageCode: 'es-ES'})
    ];

    // Set document type selector values
    this.documentType = [
      new ListValue({listValueLabel: 'LEGAL.RGPD', listValueCode: 'RGPD'}),
      new ListValue({listValueLabel: 'LEGAL.CGU', listValueCode: 'CGU'}),
      new ListValue({listValueLabel: 'LEGAL.CGV', listValueCode: 'CGV'})
    ];
  }

  /**
   * return current for controls
   */
  get f(): any {
    return this.documentForm.controls;
  }

  /**
   * Submit form method
   */
  submit(): void {
    this.submitted = true;

    // On upload case
    if (!this.documentForm.controls.source.value) {
      // Check base 64
      if (this.document.base64Data === undefined) {
        this.f.file.setErrors({required: true});
      }
    }

    // Check document type if upload situation
    if (!this.documentForm.controls.source.value && this.document.base64Data === undefined) {
      this.f.file.setErrors({required: true});
    }

    // Check form validity
    if (this.documentForm.invalid) {
      return;
    }

    // Get clean form values and populate object to post
    const formValues = this.documentForm.getRawValue();
    this.document.label = formValues.name;
    this.document.language = formValues.lang;
    this.document.typeDocument = formValues.docType;
    // this.document.source = 'UPLOAD';
    if ( formValues.source === true ) {
      // this.document.source = 'GENERATED';
      this.document.typeDocument = 'RGPD';
      this.document.jsonData = '{}';
    }

    // POST document and send emit event to parent component
    this.legalService.uploadDocument(this.document).subscribe(result => {
      if (Object.keys(result).length) {
        this.onSubmitAction.emit(result);
        this.close('done');
      }
    });

  }

  /**
   * File uploader, loads file into document as base64 data to be sent.
   * @param e any
   */
  uploadFile(e: any): void {
    // Define default values & update form errors
    this.uploaded = false;
    this.loadingDocument = true;
    this.f.file.updateValueAndValidity();

    const file: File = e.target.files[0];
    // Format validation
    if (e.target.files[0].type !== 'application/pdf') {
      this.f.file.setErrors({formatError: true});
      this.uploaded = true;
      this.loadingDocument = false;
      return;
    }
    // File size validation
    if (e.target.files[0].size > 500 * 1024) {
      this.f.file.setErrors({tooHeavy: true});
      this.uploaded = true;
      this.loadingDocument = false;
      return;
    }
    // Push name into name input of form
    // to get the value on submit & load data into document obj
    this.f.name.setValue(e.target.files[0].name);
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
        this.document.base64Data = event.target.result;
        this.loadingDocument = false;
    });
    reader.readAsDataURL(file);
  }

  /**
   * remove data from document and clear form name field
   */
  clearDocument(): void {
    this.f.name = '';
    delete this.document.base64Data;
  }

  /**
   * Modal close method
   * @param reason any
   */
  close(reason: any): void {
    this.activeModal.dismiss(reason);
  }

  private _conditionalRequiredValidator(formControl: AbstractControl): Validators | null {
    if (!formControl.parent) {
      return null;
    }

    if (formControl.parent.get('source').value === false) {
      return Validators.required(formControl);
    }
    return null;
  }
}
