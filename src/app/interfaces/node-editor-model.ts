export interface Loading {
  Audio: boolean;
  Image: boolean;
  Mp3: boolean;
}

export interface EditMode {
  status: boolean;
  id: string;
  position: number;
  index: number;
}

export interface AnswerCreate {
  text: string;
  isCancel: boolean;
}

export interface SectionList {
  id: string;
  name: string;
  type: string;
  icon: string;
}

export interface SelectList {
  name: string;
  value: string;
}
