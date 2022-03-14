import * as models from '../../interfaces/convflow-models';
import { ConvNodeVM } from './conv-nodeVM';
import { ConvConfig } from './conv-config';

export class ConvAnswerConnector {

  circleRadius = ConvConfig.answerCircleRadius;

  constructor(
    public convNodeVM: ConvNodeVM,
    public answer: models.Answer) {
  }

  x(): number {
    return this.convNodeVM.x() + ConvConfig.defaultNodeWidth - 20;
  }

  y(): number {
    const items = this.convNodeVM.convNode.Answers.AnswerList;
    const answerCount = items.length;
    return this.convNodeVM.y() + this.convNodeVM.height() - 15 - (29 * (answerCount - this.btnIndex()));
  }

  mouseDown(event: MouseEvent): void {
    const nw = this.convNodeVM.network;
    if (nw.convLastConnection.isHidden) { nw.convLastConnection.isHidden = false; }
    nw.convLastConnection.srcAnswerConnector = this;
    nw.convLastConnection.destX = this.x();
    nw.convLastConnection.destY = this.y();
  }

  btnIndex(): number {
    const item = this.convNodeVM.convNode.Answers.AnswerList;
    return item.indexOf(this.answer);
  }

  setAnswerNextNodeId(nextNodeId: string): void {
    this.answer.NextNodeId = nextNodeId;
    this.convNodeVM.network.updateConvNodeConnections();
  }

  startDirectConnection(event: MouseEvent): void {
    this.convNodeVM.network.convAnswerConnector = this;
    this.convNodeVM.network.convAnswerConnector = null;
  }

  isConnected(): boolean {
    return this.answer.NextNodeId
      && (this.convNodeVM.network.convNodeVMs.filter(x => x.convNode.Id === this.answer.NextNodeId).length > 0);
  }
}
