import { ConvNodeVM } from './conv-nodeVM';
import { ConvConnection } from './conv-connection';
import { ConvLastConnection } from './conv-last-connection';
import { ConvPoint } from './conv-point';
import { ConvAnswerConnector } from './conv-answer-connector';
import { NewBuilderComponent } from '../../modules/conversation/new-builder/new-builder.component';
import { ConvFlowPack } from '../../interfaces/convflow-models';

export class ConvFlowNetwork {
  ProjectId: string;
  convNodeVMs: ConvNodeVM[] = [];
  convConnections: ConvConnection[] = [];
  convLastConnection: ConvLastConnection = new ConvLastConnection();
  convAnswerConnector: ConvAnswerConnector;
  draggingConvNode: ConvNodeVM;
  draggingNodeOffset: ConvPoint;
  convFlowPack: ConvFlowPack;
  selectedNodeOffsets: {
    [nodeId: string]: ConvPoint;
  } = {};

  constructor(public parent: NewBuilderComponent) {
  }

  updateConvNodeConnections(): void {
    this.convConnections = [];
    this.parent.hasUpdate = true; // On node conector update
    this.convNodeVMs.forEach(node => {
      node.convNode.Answers.AnswerList.forEach(answer => {
        if (answer.NextNodeId != null || answer.NextNodeId !== '') {
          const destNode = this.convNodeVMs.filter(x => x.convNode.Id === answer.NextNodeId);
          if (destNode && destNode.length > 0) {
            this.convConnections.push(new ConvConnection(new ConvAnswerConnector(node, answer), destNode[0]));
          }
        }
      });
    });
  }

  selectedNodes(): any {
    return this.convNodeVMs.filter(x => x.isSelected);
  }

}
