import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { requiredIfValidator } from '../../../validators/required-if.validator';
import { atLeastOneValidator } from '../../../validators/at-least-one.validator';
import { childRequiredChildsValidator } from '../../../validators/child-required-childs.validator';
import { childRequiredValidator } from '../../../validators/child-required.validator';
import { legalValidator } from '../../../validators/legal.validator';
import { LegalService } from '../../../services/legal.service';
import { AlertService } from '../../../services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { LegalDocument } from '../../../classes/legal-document';

@Component({
  selector: 'app-form-generator',
  templateUrl: './form-generator.component.html',
  styleUrls: ['./form-generator.component.scss']
})
export class FormGeneratorComponent implements OnInit {

  rgpdForm: FormGroup;
  formData: any;
  submitted = false;
  processing = false;
  document: LegalDocument;
  documentId: number;

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private alertService: AlertService,
    private legalService: LegalService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.documentId = this.activatedRoute.snapshot.params.id;
    // @TODO : load document and populate form with data
    this.legalService.getDocumentById(this.documentId).subscribe(doc => {
      this.document = doc;
      this.formData = this.document.jsonData;
      console.log(doc);
      this._populateForm();
    });

    this._generateForm();
  }

  get f(): any {
    return this.rgpdForm.controls;
  }

  checkParentFromCheckbox(e, parent: string): void {
    if (e.target.checked && this.f[parent].value !== true) {
      this.f[parent].setValue(true);
    }
  }

  checkParentFromSelect(parent: string): void {
    if (this.f[parent].value !== true) {
      this.f[parent].setValue(true);
    }
  }

  checkParentFromText(e, parent: string): void {
    if (e.target.value !== ''  && this.f[parent].value !== true) {
      this.f[parent].setValue(true);
    }
  }

  saveData(alert = true): void {
    // Insert form data in LegalDocument Obj & save
    this.document.jsonData = this.rgpdForm.getRawValue();
    this.legalService.updateDocument(this.documentId, this.document)
      .subscribe(document => {
        if (Object.keys(document).length > 0) {
          if (alert) {
            this.alertService.success(this.translate.instant('ALERTS.RGPD_FORM_SAVED'), {autoClose: true});
          }
          this.document = document;
        } else if (alert) {
          this.alertService.error(this.translate.instant('ALERTS.RGPD_FORM_ERROR'));
        }
      });
  }

  /****** form submit ******/
  submitForm(): void {
    this.submitted = true;
    this.processing = true;

    if (this.rgpdForm.invalid) {
      this.processing = false;
      return;
    }

    this.saveData(false);

    this.legalService.generateForm(this.document).subscribe(doc => {
      this.processing = false;
      if (doc.url && doc.url !== '') {
        this.alertService.success(this.translate.instant('RGPD.GENERATED'), {autoClose: true});
        window.open(doc.url, '_blank').focus();
        this.document.url = doc.url;
        this.saveData(false);
        return;
      }
      this.alertService.error(this.translate.instant('RGPD.GENERATOR_ERROR'));
    });
  }

  private _generateForm(): void {
    this.rgpdForm = this.formBuilder.group({
      designation: ['', Validators.required],
      datedebut: ['', Validators.required],
      datemaj: ['', Validators.required],
      denomination: ['', Validators.required],
      formesociale: ['', Validators.required],
      immatriculation: ['', Validators.required],
      lieuimmatriculation: ['', Validators.required],
      adresse: ['', Validators.required],
      contactadresseemail: ['', Validators.required],
      contactadressepostale: ['', Validators.required],
      finalityGroup: [''],
      finaliteopt1a: ['', childRequiredValidator(['finaliteopt1a1', 'finaliteopt1a2', 'finaliteopt1a3', 'finaliteopt1a4'])],
      finaliteopt1a1: ['', childRequiredChildsValidator('finaliteopt1a', ['finaliteopt1a2', 'finaliteopt1a3', 'finaliteopt1a4'])],
      finaliteopt1a2: ['', childRequiredChildsValidator('finaliteopt1a', ['finaliteopt1a1', 'finaliteopt1a3', 'finaliteopt1a4'])],
      finaliteopt1a3: ['', childRequiredChildsValidator('finaliteopt1a', ['finaliteopt1a1', 'finaliteopt1a2', 'finaliteopt1a4'])],
      finaliteopt1a4: ['', childRequiredChildsValidator('finaliteopt1a', ['finaliteopt1a1', 'finaliteopt1a1', 'finaliteopt1a3'])],
      finaliteopt1abaselegale: [''],
      finaliteopt1abaselegale1: [''],
      finaliteopt1abaselegale2: ['', requiredIfValidator(['finaliteopt1abaselegaletexte'])],
      finaliteopt1abaselegaletexte: [''],
      finaliteopt1b: ['', childRequiredValidator(['finaliteopt1b1', 'finaliteopt1b2', 'finaliteopt1b3', 'finaliteopt1b4'])],
      finaliteopt1b1: ['', childRequiredChildsValidator('finaliteopt1b', ['finaliteopt1b2', 'finaliteopt1b3', 'finaliteopt1b4'])],
      finaliteopt1b2: ['', childRequiredChildsValidator('finaliteopt1b', ['finaliteopt1b1', 'finaliteopt1b3', 'finaliteopt1b4'])],
      finaliteopt1b3: ['', childRequiredChildsValidator('finaliteopt1b', ['finaliteopt1b1', 'finaliteopt1b2', 'finaliteopt1b4'])],
      finaliteopt1b4: ['', childRequiredChildsValidator('finaliteopt1b', ['finaliteopt1b1', 'finaliteopt1b2', 'finaliteopt1b3'])],
      finaliteopt1bbaselegale: [''],
      finaliteopt1bbaselegale1: [''],
      finaliteopt1bbaselegale2: ['', requiredIfValidator(['finaliteopt1bbaselegaletexte'])],
      finaliteopt1bbaselegaletexte: [''],
      finaliteopt1c: ['', childRequiredValidator(['finaliteopt1c1', 'finaliteopt1c2'])],
      finaliteopt1c1: ['', childRequiredChildsValidator('finaliteopt1c', ['finaliteopt1c2'])],
      finaliteopt1c2: ['', childRequiredChildsValidator('finaliteopt1c', ['finaliteopt1c1'])],
      finaliteopt1cbaselegale: [''],
      finaliteopt1cbaselegale1: [''],
      finaliteopt1cbaselegale2: ['', requiredIfValidator(['finaliteopt1cbaselegaletexte'])],
      finaliteopt1cbaselegaletexte: [''],
      finaliteopt1d: [''],
      finaliteopt1dbaselegale: [''],
      finaliteopt1dbaselegale1: [''],
      finaliteopt1dbaselegale2: ['', requiredIfValidator(['finaliteopt1dbaselegaletexte'])],
      finaliteopt1dbaselegaletexte: [''],
      finaliteopt1e: [''],
      finaliteopt1ebaselegale: [''],
      finaliteopt1ebaselegale1: [''],
      finaliteopt1ebaselegale2: ['', requiredIfValidator(['finaliteopt1ebaselegaletexte'])],
      finaliteopt1ebaselegaletexte: [''],
      finaliteopt1f: ['', requiredIfValidator(['finaliteopt1ftexte'])],
      finaliteopt1ftexte: [''],
      personalDataGroup: [''],
      donneeperso1: [''],
      donneeperso2: [''],
      donneeperso3: [''],
      donneeperso4: [''],
      donneeperso5: ['', requiredIfValidator(['donneeperso5texte'])],
      donneeperso5texte: [''],
      conservationGroup: [''],
      dureeconservation1: ['', requiredIfValidator(['dureeconservation1texte'])],
      dureeconservation1texte: [''],
      dureeconservation2: ['', requiredIfValidator(
        ['dureeconservation2texte1', 'dureeconservation2texte2', 'dureeconservation2texte3'])],
      dureeconservation2texte1: [''],
      dureeconservation2texte2: [''],
      dureeconservation2texte3: [''],
      dureeconservation3: ['', requiredIfValidator(['dureeconservation3texte'])],
      dureeconservation3texte: [''],
      dureeconservation4: ['', requiredIfValidator(['dureeconservation4texte'])],
      dureeconservation4texte: [''],
      dureeconservation5: ['', requiredIfValidator(['dureeconservation5texte'])],
      dureeconservation5texte: [''],
      destinationGroup: [''],
      destinataire1: [''],
      destinataire2: ['', requiredIfValidator(['destinataire2texte'])],
      destinataire2texte: [''],
      destinataire3: ['', requiredIfValidator(['destinataire3texte'])],
      destinataire3texte: [''],
      destinataire4: ['', requiredIfValidator(['destinataire4texte'])],
      destinataire4texte: [''],
      transfert: ['', [Validators.required, requiredIfValidator(['transfertPays'])]],
      transfertPays: ['', requiredIfValidator(['transfertPaystexte'])],
      transfertPaystexte: ['']
    }, { validators: [
        atLeastOneValidator('finalityGroup',
          ['finaliteopt1a', 'finaliteopt1b', 'finaliteopt1c', 'finaliteopt1d', 'finaliteopt1e', 'finaliteopt1f']),
        legalValidator('finaliteopt1abaselegale', 'finaliteopt1a', ['finaliteopt1abaselegale1', 'finaliteopt1abaselegale2']),
        atLeastOneValidator('personalDataGroup',
          ['donneeperso1', 'donneeperso2', 'donneeperso3', 'donneeperso4', 'donneeperso5']),
        atLeastOneValidator('conservationGroup',
          ['dureeconservation1', 'dureeconservation2', 'dureeconservation3', 'dureeconservation4', 'dureeconservation5']),
        atLeastOneValidator('destinationGroup', ['destinataire1', 'destinataire2', 'destinataire3', 'destinataire4'])
      ]});
  }

  private _populateForm(): void {
    Object.keys(this.formData).forEach( key => {
      this.rgpdForm.get(key).setValue(this.formData[key]);
    });
  }
}
