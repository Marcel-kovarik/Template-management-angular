import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ObjectID } from 'bson';
import { ConversationService } from '../../../services/conversation.service';
import { ConvFlowNetwork } from '../../../classes/conversation/conv-flow-network';
import { ConvNodeVM } from '../../../classes/conversation/conv-nodeVM';
import { ConvConfig } from '../../../classes/conversation/conv-config';
import { ConvFlowPack, NodeLocations } from '../../../interfaces/convflow-models';
import { Voice } from '../../../classes/voice';
import { TranslateService } from '@ngx-translate/core';
import { Conversation } from '../../../classes/conversation';
import { AlertService } from '../../../services/alert.service';
import { StatesService } from '../../../services/states.service';
import { CreationService } from '../../../services/creation.service';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DialogService } from '../../../services/dialog.service';

@Component({
  selector: 'app-new-builder',
  templateUrl: './new-builder.component.html',
  styleUrls: ['./new-builder.component.scss']
})

export class NewBuilderComponent implements OnInit, OnDestroy {

  @ViewChild('conversationRoot') conversationRoot: ElementRef;

  voiceList: Voice[] = [];
  voiceId: string;
  isShowEditor = false;
  hasUpdate = false;
  preview = false;
  previewUrl: string;
  previewCode: string;
  voicePreviewLang: string;
  conversationCode: string;

  saving = false;
  unpacking = false;
  previewing = false;
  publishing = false;
  publishable = [];
  previewable = false;

  timer: any;
  saveTimoutLap = environment.autoConversationSaveTimer;

  convFlowNetwork: ConvFlowNetwork;
  editedNode: ConvNodeVM;
  currentConversation: Conversation;
  ctrlDown: boolean;
  isMouseDown = false;
  viewBoxWidth: number;
  viewBoxHeight: number;
  testVoiceSentence: string;

  viewBoxX: number;
  viewBoxY: number;

  animationFrameId = 0;

  @HostListener('window:beforeunload', ['$event'])
  canDeactivate(): Observable<boolean> | boolean {
    return !this.hasUpdate;
  }

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private stateService: StatesService,
    private alertService: AlertService,
    private translate: TranslateService,
    private creationService: CreationService,
    private dialogService: DialogService,
    private conversationService: ConversationService) {

    this.convFlowNetwork = new ConvFlowNetwork(this);
    this.convFlowNetwork.convLastConnection.isHidden = true;
    this.viewBoxX = 0;
    this.viewBoxY = 0;
    this.viewBoxWidth = ConvConfig.defaultDesignerWidth;
    this.viewBoxHeight = ConvConfig.defaultDesignerHeight;
  }

  ngOnInit(): void {
    // Remove padding to make canvas 100% height/width
    document.getElementById('content').style.padding = '0px';

    this.currentConversation = this.conversationService.getCurrentConversation();

    if (this.currentConversation !== undefined && this.currentConversation !== null) {
      this.conversationCode = this.currentConversation.languageCode;
      this.voiceId = this.conversationService.getLatestVersion().voiceId;
      this._unpackConversation(this.conversationService.getCurrentFlowPack());
      this.voicePreviewLang = this.currentConversation.languageCode;
      // this._setDemoSentence(this.currentConversation.languageCode);
      this.testVoiceSentence = this.translate.instant('CONVERSATION.VOICE_SAMPLE');
      this.conversationService.getVoicesByLanguageCode('CREAPUB', this.currentConversation.languageCode).subscribe( voices => {
        this.voiceList = voices;
        if (!this.voiceId) {
          voices.forEach(v => {
            if (v.defaultVoice) {
              this.updateVoiceId(v.voiceId);
            }
          });
        }
        this._updateCrumbMenuPreview(latest.state);
      });
      this._warnReasons(true);
      const latest = this.conversationService.getLatestVersion();
      this.conversationCode = latest.languageCode;
      this._updateCrumbMenuPublish(latest.state);
      this.conversationService.getSettingsFromServer(this.currentConversation.id, latest.id).subscribe();
    } else {
      this.router.navigate(['/campaigns/formats/edit']);
    }

  }

  ngOnDestroy(): void {
    // Avoid auto save to trigger after page quit.
    this.setHasUpdate(false);
    // Reset paddings
    document.getElementById('content').style.paddingLeft = '40px';
    document.getElementById('content').style.paddingRight = '40px';
  }

  updateVoiceId(voiceId: string): void {
    this.setHasUpdate(true); // Voice update
    this.voiceId = voiceId;
  }

  showPreview(): void {
    this.previewing = true;
    if (this.hasUpdate) {
      this.saveCurrentConversation(() => { this.showPreview(); });
      return;
    }
    this.conversationService.getLatestVersionOfConversation().subscribe( resp => {
      this.conversationService.previewConversation(resp.conversationId, resp.id).subscribe( prevResp => {
        if (prevResp.ok) {
          this.previewUrl = prevResp.url;
          this.previewCode = prevResp.convCode;
          this.preview = !this.preview;
          // this.alertService.success(this.translate.instant('CONVERSATION.PREVIEWABLE'), {autoClose: true});
        } else {
          this.alertService.error(this.translate.instant('CONVERSATION.PREVIEW_ERROR'));
        }
        this.previewing = false;
      });
    });
  }

  closePreview(): void {
    this.preview = false;
  }

  prePublish(): void {
    this.dialogService.confirm(this.translate.instant('CONVERSATION.PUBLISH_CONFIRM'))
      .then(resp => {
        if (resp) {
          if (this.hasUpdate) {
            this.saveCurrentConversation(() => { this._publish(); });
            return;
          }
          this._publish();
        }
      }).catch();
  }

  _publish(): void {
    this.publishing = true;
    this.conversationService.getLatestVersionOfConversation().subscribe( latestConv => {
      this.conversationService.publishConversation(latestConv.conversationId, latestConv.id).subscribe( serverState => {
        this.creationService.updateCurrentCreation((r) => {
          this._updateCrumbMenuPublish(r.conversation.state);
          this._updateCrumbMenuPreview(r.conversation.state);
        });
        if (serverState.ok) {
          const answersList = [
            {text: 'New format', route: '/campaigns/formats/list'},
            {text: 'Creation page', route: '/campaigns/formats/edit'}
          ];
          this.dialogService.whatNext('CONVERSATION.PUBLISHED_WHAT_NEXT', {answers: answersList});
        } else {
          this.alertService.error(this.translate.instant('CONVERSATION.PUBLISHED_ERROR'));
        }
        this.publishing = false;
      });
    });
  }

  saveCurrentConversation(next?: () => any): void {
    // to save conversation
    this.saving = true;
    this.conversationService.recordCurrentSettings();
    this.conversationService.saveConversation(this.currentConversation.id, this._packConversationFlow(), this.voiceId)
      .subscribe(response => {
        this._unpackConversation(response.representationModel);
        this.creationService.updateCurrentCreation();
        this._updateCrumbMenuPublish(this.conversationService.getLatestVersion().state);
        this._updateCrumbMenuPreview(this.conversationService.getLatestVersion().state);
        this.alertService.clear();
        if (next) {
          next();
        } else {
          this._warnReasons(true);
          this.alertService.success(this.translate.instant('CONVERSATION.SAVED'), {autoClose: true});
        }
        // Animation close & update flag reset
        this.saving = this.hasUpdate = false;
      });
  }


  _updateCrumbMenuPublish(state: number): void {
    if (this.stateService.hasXReady(state)) {
      this.publishable = [];
    } else {
      if ((this.stateService.hasReady(state) && (this.stateService.hasUpdated(state) || this.stateService.hasPreview(state)))) {
        this.publishable = [];
      } else {
        this.publishable.push('CONVERSATION.MISSING.NOTHING');
      }
    }
  }

  _updateCrumbMenuPreview(state: number): void {
    this.previewable = (this.stateService.hasReady(state) || this.stateService.hasPublished(state)) ? true : false;
  }

  setHasUpdate(hasUpdate: boolean): void {
    if (this.unpacking) {
      return;
    }
    this.hasUpdate = hasUpdate;
    window.clearTimeout(this.timer);
    if (hasUpdate) {
      this.timer = window.setTimeout(() => {
        if (this.hasUpdate) {
          this.saveCurrentConversation();
          this.hasUpdate = false;
        }
      }, this.saveTimoutLap);
    }
  }

  conversationRootSVG(): SVGSVGElement {
    return this.conversationRoot.nativeElement as SVGSVGElement;
  }

  clearSelection(): void {
    this.convFlowNetwork.convNodeVMs.forEach(x => {
      x.isSelected = false;
    });
  }

  deleteNode(): void {
    this.setHasUpdate(true); // Node deleted
    const elementIdxToDel = this.convFlowNetwork.convNodeVMs.findIndex(x => x.convNode.Id === this.editedNode.convNode.Id);
    if (this.convFlowNetwork.convNodeVMs[elementIdxToDel].convNode.IsStartNode) {
      this.alertService.error(this.translate.instant('CONVERSATION.CANT_DELETE_NODE'), {autoClose: true});
      return;
    }

    this.convFlowNetwork.convNodeVMs.splice(elementIdxToDel, 1);
    this.convFlowNetwork.updateConvNodeConnections();
    this.convFlowNetwork.parent.updateLayout();
  }

  updateLayout(): void {
    this.setHasUpdate(true); // multiple action use this methode to update display
    if (this.convFlowNetwork &&
      this.convFlowNetwork.convNodeVMs &&
      this.convFlowNetwork.convNodeVMs.length > 0 &&
      this.conversationRoot) {
      const ele = this.conversationRootSVG();
      if (ele.querySelector) { // Initialization issues, proceed only if querySelector is available.
        for (const nodeVM of this.convFlowNetwork.convNodeVMs) {
          const convNode = nodeVM;

          const updateNodeLayoutInit = this.updateNodeLayout(convNode);
          if (!updateNodeLayoutInit || !convNode.layoutUpdated) {
            window.requestAnimationFrame(() => this.updateLayout());
            break;
          }
        }
      }
    }
  }

  updateNodeLayout(convNodeVM: ConvNodeVM): boolean {
    this.setHasUpdate(true);
    const btnTable = this.conversationRootSVG().querySelector(`div[node-id='${convNodeVM.convNode.Id}']`) as HTMLTableElement;
    if (btnTable) {
      // If this is not done, when new section is added to the node, node's width is also increasing abnormally!
      if (!convNodeVM.layoutUpdated) { convNodeVM.btnTableWidth = btnTable.getBoundingClientRect().width; }
      else {
        convNodeVM.btnTableWidth = btnTable.clientWidth;
      }
      convNodeVM.convNodeWidth = ((convNodeVM.convNodeWidth > convNodeVM.btnTableWidth) ?
        convNodeVM.convNodeWidth : convNodeVM.btnTableWidth);

      window.requestAnimationFrame(() => {
        const nodeRoot = this.conversationRootSVG().querySelector(`div[node-id='${convNodeVM.convNode.Id}']`) as HTMLDivElement;
        convNodeVM.convNodeHeight = nodeRoot.clientHeight + 20;
        convNodeVM.layoutUpdated = true;
      });
      return true;
    }

    return false;
  }

  ngTr(x: number, y: number): string {
    return `translate(${x},${y})`;
  }

  mouseMove(event: MouseEvent): void {
    if (!this.convFlowNetwork.convLastConnection.isHidden) {
      const targetXY = this.transformCoordinates(event.pageX, event.pageY, event);
      this.convFlowNetwork.convLastConnection.destX = targetXY.x - 30;
      this.convFlowNetwork.convLastConnection.destY = targetXY.y - 30;
    }

    if (this.convFlowNetwork.draggingConvNode) {
      try {
        this.setHasUpdate(true); // Node position update
        const targetXY = this.transformCoordinates(event.pageX, event.pageY, event);
        const offset = this.convFlowNetwork.draggingNodeOffset;
        this.convFlowNetwork.draggingConvNode.xx = targetXY.x - offset.x;
        this.convFlowNetwork.draggingConvNode.yy = targetXY.y - offset.y;

        const selectedNodes = this.convFlowNetwork.selectedNodes();
        if (selectedNodes && selectedNodes.length > 0) {
          for (const selectedNode of selectedNodes) {
            const thisNode = selectedNode;
            const thisOffset = this.convFlowNetwork.selectedNodeOffsets[thisNode.convNode.Id];
            if (thisOffset) {
              thisNode.xx = targetXY.x - thisOffset.x;
              thisNode.yy = targetXY.y - thisOffset.y;
            }
          }
        }
      } catch (e) {
        this.convFlowNetwork.draggingConvNode.xx += event.movementX;
        this.convFlowNetwork.draggingConvNode.yy += event.movementY;
      }
    }

    if (this.isMouseDown) {
      this.viewBoxX -= event.movementX;
      this.viewBoxY -= event.movementY;
    }
  }

  transformCoordinates(x: number, y: number, event: MouseEvent): any {
    const svgElem = this.conversationRootSVG();
    const matrix = svgElem.getScreenCTM();
    const point = svgElem.createSVGPoint();
    point.x = x - event.view.pageXOffset;
    point.y = y - event.view.pageYOffset;
    return point.matrixTransform(matrix.inverse());
  }

  mouseDown(event: MouseEvent): void {
    // cancel any ongoing animation as user might have interrupted it by doing the mouse down.
    this.zoomCancel();

    // Check if mouse is captured by others
    this.isMouseDown = this.convFlowNetwork.convLastConnection.isHidden && !this.convFlowNetwork.draggingConvNode;
  }

  mouseUp(event: MouseEvent): void {
    this.resetDraggingState();
  }

  mouseLeave(event: MouseEvent): void {
    this.resetDraggingState();
  }

  viewBox(): string {
    // 0 0 1000 500
    return `${this.viewBoxX} ${this.viewBoxY} ${this.viewBoxWidth} ${this.viewBoxHeight}`;
  }

  zoomToRectWithAnimation(x: number, y: number, width: number, height: number): void {
    this.zoomToRectAnimIntermediate(
      this.viewBoxX, this.viewBoxY, this.viewBoxWidth, this.viewBoxHeight,
      x, y, width, height);
  }

  zoomCancel(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  zoomToRectAnimIntermediate(
    x1: number, y1: number, width1: number, height1: number,
    x2: number, y2: number, width2: number, height2: number): void {
    const step = ConvConfig.viewBoxAnimStep * ((Math.abs(x1 - x2) + Math.abs(y1 - y2) +
      Math.abs(width1 - width2) + Math.abs(height1 - height2)) / 100);
    this.viewBoxX = this.tendValue(x1, x2, step);
    this.viewBoxY = this.tendValue(y1, y2, step);
    this.viewBoxWidth = this.tendValue(width1, width2, step);
    this.viewBoxHeight = this.tendValue(height1, height2, step);

    if (!this.approxEquals(this.viewBoxX, x2, step) ||
      !this.approxEquals(this.viewBoxY, y2, step) ||
      !this.approxEquals(this.viewBoxWidth, width2, step) ||
      !this.approxEquals(this.viewBoxHeight, height2, step)) {
      this.animationFrameId = requestAnimationFrame(() => {
        this.zoomToRectAnimIntermediate(
          this.viewBoxX, this.viewBoxY, this.viewBoxWidth, this.viewBoxHeight,
          x2, y2, width2, height2);
      });
    } else {
      this.animationFrameId = 0;
    }
  }

  tendValue(value: number, tendsTo: number, step: number): number {
    return (Math.abs(value - tendsTo) > step ? (value > tendsTo ? value - step : value + step) : value);
  }

  approxEquals(a: number, b: number, approx: number): boolean {
    return Math.abs(Math.round(b) - Math.round(a)) <= Math.round(approx);
  }

  fitViewToAllNodes(): void {
    this.fitViewToNodes(this.convFlowNetwork.convNodeVMs);
  }

  fitViewToNodes(convNodeVMs: ConvNodeVM[]): void {
    const Xs = convNodeVMs.map(x => x.xx);
    const Ys = convNodeVMs.map(x => x.yy);

    const XsWithWidth = convNodeVMs.map(x => x.xx + x.convNodeWidth);
    const YsWithHeight = convNodeVMs.map(x => x.yy + x.convNodeHeight);

    const minX = Math.min(...Xs);
    const minY = Math.min(...Ys);
    const maxX = Math.max(...XsWithWidth);
    const maxY = Math.max(...YsWithHeight);
    let width = maxX - minX;
    let height = maxY - minY;
    if (width < ConvConfig.maxZoomWidth) { width = ConvConfig.maxZoomWidth; }
    if (height < ConvConfig.maxZoomHeight) { height = ConvConfig.maxZoomHeight; }

    this.zoomToRectWithAnimation(minX, minY, width, height);
  }

  designerWheel(event: WheelEvent): void {
    event.preventDefault();

    // cancel any ongoing animation as user might have interrupted it by doing the mouse down.
    this.zoomCancel();

    const change = ConvConfig.zoomCoefficient * event.deltaY;
    if (this.viewBoxWidth - change > 0) { this.viewBoxWidth -= change; }
    if (this.viewBoxHeight - change > 0) { this.viewBoxHeight -= change; }
    if (this.viewBoxWidth < ConvConfig.maxZoomWidth) { this.viewBoxWidth = ConvConfig.maxZoomWidth; }
    if (this.viewBoxHeight < ConvConfig.maxZoomHeight) { this.viewBoxHeight = ConvConfig.maxZoomHeight; }
  }

  openEditor(convNodeVM: ConvNodeVM): void {
    this.isShowEditor = true;
    this.editedNode = convNodeVM;
  }

  closeEditor(): void {
    this.isShowEditor = false;
  }

  addNewNode(): void {
    const newNodeVM = new ConvNodeVM(this.convFlowNetwork, {
      Name: this.translate.instant('BUTTONS.NEW_NODE'),
      Id: new ObjectID().toHexString(),
      IsEndNode: true,
      IsStartNode: false,
      hasEndLink: false,
      Sections: [],
      Answers: { AnswerList: [] }
    });

    newNodeVM.xx = (this.viewBoxX + (this.viewBoxWidth / 2)) + (Math.random() * 50);
    newNodeVM.yy = (this.viewBoxY + (this.viewBoxHeight / 2)) + (Math.random() * 50) - 200;
    newNodeVM.layoutUpdated = true; // To skip the loading indicator

    this.convFlowNetwork.updateConvNodeConnections();
    this.updateLayout();
  }

  private resetDraggingState(): void {
    if (!this.convFlowNetwork.convLastConnection.isHidden) { this.convFlowNetwork.convLastConnection.isHidden = true; }
    if (this.convFlowNetwork.draggingConvNode) { delete this.convFlowNetwork.draggingConvNode; }
    this.isMouseDown = false;
  }

  layoutReady(): boolean {
    if (!this.convFlowNetwork.convNodeVMs) { return true; }
    else {
      return (this.convFlowNetwork.convNodeVMs.filter(x => x.layoutUpdated).length === this.convFlowNetwork.convNodeVMs.length);
    }
  }

  initialZoom(): void {
    if (this.layoutReady()) { this.fitViewToAllNodes(); }
    else { setTimeout(() => this.initialZoom(), 500); }
  }

  private _warnReasons(publishInfo?: boolean): void {
    const latestConversation = this.conversationService.getLatestVersion();
    this.conversationService.getPendingConversationErrors(
      latestConversation.conversationId, latestConversation.id).subscribe(resp => {
      if (resp.reason && resp.reason.length) {
        this.publishable = resp.reason;
        this.previewable = false;
      } else if (publishInfo) {
        // this.alertService.info(this.translate.instant('CONVERSATION.READY_TO_PUBLISH'), {autoClose: true});
      }
    });
  }

  private _packConversationFlow(): ConvFlowPack {
    const nodeLocs: NodeLocations = {};

    this.convFlowNetwork.convNodeVMs.forEach(node => {
      nodeLocs[node.convNode.Id] = {
        x: node.xx,
        y: node.yy
      };
    });

    const packConversation: ConvFlowPack = {
      ProjectId: this.convFlowNetwork.convFlowPack.ProjectId,
      ConvNodes: this.convFlowNetwork.convNodeVMs.map(x => x.convNode),
      NodeLocations: nodeLocs,
      _id: this.convFlowNetwork.convFlowPack._id,
      CreatedOn: this.convFlowNetwork.convFlowPack.CreatedOn,
      UpdatedOn: this.convFlowNetwork.convFlowPack.UpdatedOn
    };

    return packConversation;
  }

  /**
   * Set the sentence used for voice demo
   * @param lang string
   * @private
   */
  private _setDemoSentence(lang: string): void {
    // Set default (current interface language) sentence.
    this.testVoiceSentence = this.translate.instant('CONVERSATION.VOICE_SAMPLE');
    // Test if language has translation and is activated for builder
    if (this.translate.getLangs().includes(lang)) {
      this.translate.getTranslation(lang).subscribe(translation => {
        // Check if key has been translated
        if (translation.CONVERSATION.VOICE_SAMPLE) {
          this.testVoiceSentence = translation.CONVERSATION.VOICE_SAMPLE;
        }
      });
    } else {
      // Warn user that sentence will be in editor language
      this.alertService.warn(this.translate.instant('CONVERSATION.VOICE_SAMPLE_NOT_SUPPORTED'));
    }
  }

  private _unpackConversation(packConversation: ConvFlowPack): void {
    this.unpacking = true;
    if (packConversation.ConvNodes) {
      this.convFlowNetwork.convFlowPack = packConversation;
      this.convFlowNetwork.convNodeVMs = [];

      packConversation.ConvNodes.forEach(node => {
        const nn = new ConvNodeVM(this.convFlowNetwork, node);
        nn.layoutUpdated = true;
      });

      this.convFlowNetwork.convNodeVMs.forEach(vm => {
        const locs = packConversation.NodeLocations;
        if (Object.keys(locs).length > 0) {
          vm.xx = locs[vm.convNode.Id].x;
          vm.yy = locs[vm.convNode.Id].y;
        }
      });
      // Delay updates to happen after layout is fully loaded
      setTimeout(() => {
        this.convFlowNetwork.updateConvNodeConnections();
        this.updateLayout();
        this.fitViewToAllNodes();
        this.unpacking = false;
        this.setHasUpdate(false);
      }, 10);
    }
  }

 }
