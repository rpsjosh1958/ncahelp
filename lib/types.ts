export type DivisionId = "bmc" | "mobile" | "broadcasting" | "satellite";

export interface Division {
  id: DivisionId;
  code: string;
  name: string;
  band: string;
  color: string;
  summary: string;
  shiftBased: boolean;
  headId: string;
  onDuty: string | null;
  /** Link to the matching official licensing category on nca.org.gh, where one exists. */
  officialUrl?: string;
}

export interface WalkthroughStep {
  title: string;
  detail: string;
}

export interface Walkthrough {
  id: string;
  division: DivisionId;
  title: string;
  duration: string;
  updated: string;
  tags: string[];
  summary: string;
  steps: WalkthroughStep[];
}

export interface LetterFormat {
  salutation: string;
  subject: string;
  bodyOutline: string[];
  signoff: string;
  enclosures: string[];
}

export interface LetterSample {
  ref: string;
  date: string;
  recipientLines: string[];
  salutation: string;
  subject: string;
  /** Paragraphs of the filled sample letter. May contain **bold** markup. */
  body: string[];
  signoff: string;
  typistCode?: string;
  attachmentNote?: string;
}

export interface LetterTemplate {
  id: string;
  title: string;
  division: DivisionId;
  description: string;
  approverId: string;
  approvalChain: string[];
  refFormat: string;
  format: LetterFormat;
  sample: LetterSample;
  /** Link to the matching official licensing category on nca.org.gh, where one exists. */
  officialUrl?: string;
}

export interface OrgPerson {
  id: string;
  name: string;
  title: string;
  division: DivisionId | null;
  reportsTo: string | null;
  rank: number;
  signs: string | null;
}

export interface OrgChart {
  people: OrgPerson[];
  approvalNotes: string;
}
