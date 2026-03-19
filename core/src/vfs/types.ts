export type VfsOperationType = 'create' | 'modify' | 'delete';

export interface VfsOperation {
  type: VfsOperationType;
  path: string;
  content?: string;
  previousContent?: string; // For modify: original content for diff/preview
}
