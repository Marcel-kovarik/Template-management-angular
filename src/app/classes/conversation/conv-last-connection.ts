import { ConvAnswerConnector } from './conv-answer-connector';

export class ConvLastConnection {
  srcAnswerConnector: ConvAnswerConnector;
  destX: number;
  destY: number;

  isHidden = false;
  canConnect = false;

  srcConnectorX(): number {
    if (this.srcAnswerConnector) { return this.srcAnswerConnector.x(); }
    return 0;
  }
  srcConnectorY(): number {
    if (this.srcAnswerConnector) { return this.srcAnswerConnector.y(); }
    return 0;
  }

  calcTangentOffset(pt1X: number, pt2X: number): number {
    return ((pt2X - pt1X) / 2);
  }

  calcSrcTangentX(): number {
    const pt1X = this.srcConnectorX();
    const pt2X = this.destX;
    return pt1X + this.calcTangentOffset(pt1X, pt2X);
  }
  calcSrcTangentY(): number {
    return this.srcConnectorY();
  }

  calcDestTangentX(): number {
    const pt1X = this.srcConnectorX();
    const pt2X = this.destX;
    return pt2X - this.calcTangentOffset(pt1X, pt2X);
  }
  calcDestTangentY(): number {
    return this.destY;
  }

  path(): string {
    if (this.isHidden) { return 'M 0,0'; }
    return `M${this.srcConnectorX()},${this.srcConnectorY()}
                C${this.calcSrcTangentX()},${this.calcSrcTangentY()}
                  ${this.calcDestTangentX()},${this.calcDestTangentY()}
                ${this.destX},${this.destY}`;
  }
}
