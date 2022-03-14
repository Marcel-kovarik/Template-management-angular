import { Builtin } from '../classes/builtin';
import { ConvPoint } from '../classes/conversation/conv-point';
import { TextSection } from '../classes/text-section';

// Enum Start
export enum SectionType {
  Image = 'Image',
  Text = 'Text',
  Link = 'Link',
  Audio = 'Audio'
}

export enum ButtonType {
  NextNode = 'NextNode'
}

export enum AnswerType {
  MultipleChoice = 'MultipleChoice',
  Phone = 'Phone',
  Address = 'Address',
  Email = 'Email'
}

export enum OpenEndedType {
  Phone = 'Phone',
  Address = 'Address',
  Email = 'Email'
}

export enum DefaultNodeName {
  NoInput = 'No Input',
  GenericError = 'Generic Error'
}

export enum SelectedType {
  Phone = 'Phone',
  Address = 'Address'
}
// Enums End

// Sections - Start
export interface BaseIdEntity {
  _id: string;
}

export interface Section extends BaseIdEntity {
  SectionType: SectionType;
  Hidden?: boolean;
  AddText?: TextSection;
  AddImage?: ImgSection;
  AddAudio?: AudSection;
  AddLink?: LinkSection;
}

export interface LinkSection {
  text: string;
  link: string;
}

export interface ImgSection {
  src: string;
  imgName?: string;
}

export interface AudSection {
  src: string;
  audName: string;
  audSize: number;
}

// Sections - End

export interface SynonymsItem {
  SynonymsId: string;
  Text: string;
}

export interface Synonyms {
  button?: string[];
  SynonymsItem: SynonymsItem[];
}

export interface Styles {
  textColor: string;
  bgColor: string;
}

export interface Country {
  name: string;
  value: string;
  NextNodeId?: string;
}

export interface AnswerEdit {
  synonyms?: Synonyms;
  image?: ImgSection;
  styles?: Styles;
}

export interface Answer extends BaseIdEntity {
  AnswerText?: string;
  NextNodeId?: string;
  AnswerEdit?: AnswerEdit;
  BuiltinLabel?: string;
  Builtin?: Builtin;
}

export interface AnswerModel {
  AnswerType?: AnswerType;
  OpenEndedType?: OpenEndedType;
  AnswerList?: Answer[];
}

export interface ConvNode {
  Name: string;
  Id: string;
  Sections: Array<Section[]>;
  Answers: AnswerModel;
  NextNodeId?: string;
  IsStartNode?: boolean;
  IsEndNode?: boolean;
  IsDefaultNode?: boolean;
  hasEndLink?: boolean;
}

export interface NodeLocations {
  [key: string]: ConvPoint;
}

export interface ConvFlowPack {
  ProjectId: number;
  ConvNodes: ConvNode[];
  NodeLocations?: NodeLocations;
  CreatedOn: Date;
  UpdatedOn: Date;
  _id: number;
}
