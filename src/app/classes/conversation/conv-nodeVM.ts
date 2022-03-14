import * as models from '../../interfaces/convflow-models';
import { ConvConfig } from './conv-config';
import { ConvFlowNetwork } from './conv-flow-network';
import { ConvPoint } from './conv-point';
import { ConvAnswerConnector } from './conv-answer-connector';

export class ConvNodeVM {

  xx = 0;
  yy = 0;

  isSelected = false;
  layoutUpdated = false;

  circleRadius = ConvConfig.answerCircleRadius;
  btnTableWidth: number = ConvConfig.defaultNodeWidth;
  convNodeWidth: number = ConvConfig.defaultNodeWidth;
  convNodeHeight: number = ConvConfig.defaultNodeHeight;

  constructor(
    public network: ConvFlowNetwork,
    public convNode: models.ConvNode) {
    this.network.convNodeVMs.push(this);
    this.xx = (this.network.convNodeVMs.indexOf(this)) * ConvConfig.defaultNodeWidth;
  }

  width(): number {
    return this.convNodeWidth;
  }

  height(): number {
    return this.convNodeHeight;
  }

  x(): number {
    return this.xx;
  }

  y(): number {
    return this.yy;
  }

  mouseDown(event: MouseEvent): void {
    if (!this.network.parent.ctrlDown && this.network.selectedNodes().length <= 1) {
      this.network.parent.clearSelection();
    }
    this.toggleSelection();

    this.network.draggingConvNode = this;

    const targetXY = this.network.parent.transformCoordinates(event.pageX, event.pageY, event);
    const mouseOffsetX = targetXY.x - this.xx;
    const mouseOffsetY = targetXY.y - this.yy;
    this.network.draggingNodeOffset = new ConvPoint(mouseOffsetX, mouseOffsetY);

    this.network.selectedNodeOffsets = {}; // clearing
    const selectedNodes = this.network.selectedNodes();
    if (selectedNodes && selectedNodes.length > 0) {
      selectedNodes.forEach(n => {
        const mouseOffset = {
          x: targetXY.x - n.xx,
          y: targetXY.y - n.yy,
        };
        this.network.selectedNodeOffsets[n.convNode.Id] = new ConvPoint(mouseOffset.x, mouseOffset.y);
      });
    }
  }

  mouseUp(event: MouseEvent): void {
    // console.log(event);
    const nw = this.network;
    if (!nw.convLastConnection.isHidden && !this.convNode.IsDefaultNode && !this.convNode.IsStartNode) {
      nw.convLastConnection.srcAnswerConnector.setAnswerNextNodeId(this.convNode.Id);
    }
  }

  mouseEnter(event: MouseEvent): void {
    // console.log(event);
    const nw = this.network;
    if (!nw.convLastConnection.isHidden) {
      nw.convLastConnection.canConnect = true;
    }
  }

  mouseLeave(event: MouseEvent): void {
    // console.log(event);
    const nw = this.network;
    if (!nw.convLastConnection.isHidden) {
      nw.convLastConnection.canConnect = false;
    }
  }

  chatAnswerConnectors(): any {
    return this.convNode.Answers.AnswerList.map(answer => new ConvAnswerConnector(this, answer));
  }

  nodeConnectorY(): number {
    return this.y() + this.height() / 2;
  }

  nodeConnectorX(): number {
    return (this.x()) + this.circleRadius + 3;
  }

  toggleSelection(): void {
    this.isSelected = !this.isSelected;
  }

  isNodeEmpty(): boolean {
    return (!this.convNode.Sections || this.convNode.Sections.length <= 0);
  }
}
