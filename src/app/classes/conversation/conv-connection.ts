import { ConvAnswerConnector } from './conv-answer-connector';
import { ConvNodeVM } from './conv-nodeVM';
import { ConvConfig } from './conv-config';

export class ConvConnection {
  constructor(
    public srcAnswerConnector: ConvAnswerConnector,
    public destConvNode: ConvNodeVM) {
  }

  closeAnswerVisible = false;
  closeAnswerPointX = 0;
  closeAnswerPointY = 0;

  pathWidth = ConvConfig.connectionPathWidth;

  srcConnectorX(): number {
    return this.srcAnswerConnector.x() - (this.pathWidth / 2);
  }
  srcConnectorY(): number {
    return this.srcAnswerConnector.y();
  }

  destConnectorX(): number {
    return this.destConvNode.nodeConnectorX() - (this.pathWidth / 2);
  }

  destConnectorY(): number {
    return this.destConvNode.nodeConnectorY();
  }

  calcTangentOffset(pt1X: number, pt2X: number): number {
    return ((pt2X - pt1X) / 2);
  }

  calcSrcTangentX(): number {
    const pt1X = this.srcConnectorX();
    const pt2X = this.destConnectorX();
    return pt1X + this.calcTangentOffset(pt1X, pt2X);
  }

  calcSrcTangentY(): number {
    return this.srcConnectorY();
  }

  calcDestTangentX(): number {
    const pt1X = this.srcConnectorX();
    const pt2X = this.destConnectorX();
    return pt2X - this.calcTangentOffset(pt1X, pt2X);
  }

  calcDestTangentY(): number {
    return this.destConnectorY();
  }

  path(): string {
    return `M${this.srcConnectorX()},${this.srcConnectorY()}
                C${this.calcSrcTangentX()},${this.calcSrcTangentY()}
                  ${this.calcDestTangentX()},${this.calcDestTangentY()}
                ${this.destConnectorX()},${this.destConnectorY()} M${this.srcConnectorX()},${this.srcConnectorY()}
                C${this.calcSrcTangentX()},${this.calcSrcTangentY()}
                  ${this.calcDestTangentX()},${this.calcDestTangentY()}
                ${this.destConnectorX()},${this.destConnectorY()}`; // double path to render connections with hollow shapes
  }

  mouseEnter(event: MouseEvent): void {
    const xy = this.destConvNode.network.parent.transformCoordinates(event.pageX, event.pageY, event);
    this.closeAnswerPointX = xy.x; // some offset from the cursor
    this.closeAnswerPointY = xy.y; // some offset from the cursor
    this.closeAnswerVisible = true;

    setTimeout(() => {
      this.closeAnswerVisible = false;
    }, 50000); // Hide the close answer after 5secs
  }

  remove(event: MouseEvent): void {
    // console.log(event);
    this.srcAnswerConnector.setAnswerNextNodeId(null);
    this.destConvNode.network.updateConvNodeConnections();
  }
}

