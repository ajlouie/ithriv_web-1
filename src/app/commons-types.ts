import { Icon } from './icon';
import { Institution } from './institution';
import { User } from './user';
import { Subscription } from 'rxjs';
export interface Project {
  id?: string;
  collab_mgmt_service_id?: string;
  name?: string;
  name_alts?: string;
  pl_pi?: string;
  description?: string;
  keywords?: string;
  funding_source?: string;
  partners?: string;
  owners: Array<string>;
  collaborators: Array<string>;
  private?: boolean;
  institution?: Institution;
  icon?: Icon;
  can_delete_data: boolean;
  can_delete_meta: boolean;
  can_download_data: boolean;
  can_manage_permission: boolean;
  can_update_meta: boolean;
  can_upload_data: boolean;
  documents: Array<ProjectDocument>;
  web_page_url?: string;
}

export interface Dataset {
  id?: string;
  project_id?: string;
  name?: string;
  description?: string;
  keywords?: string;
  last_modified?: string;
  private?: boolean;
  private_data?: boolean;
  institution?: Institution;
  identifiers_hipaa?: string;
  other_sensitive_data?: string;
  url?: string;
  filename?: string;
  can_delete_data: boolean;
  can_delete_meta: boolean;
  can_download_data: boolean;
  can_manage_permission: boolean;
  can_restore_data: boolean;
  can_update_meta: boolean;
  can_upload_data: boolean;
  based_on_dataset_id?: string;
  variable_measured?: string;
  license?: string;
  spatial_coverage_address?: string;
  temporal_coverage_date?: string;
  approved_irb_link?: string;
  contract_link?: string;
  link_to_external_dataset?: string;
}

export class FileUploadModel {
  data: File;
  state: string;
  inProgress: boolean;
  progress: number;
  canRetry: boolean;
  canCancel: boolean;
  sub?: Subscription;
}

export interface DatasetFileVersion {
  _fileActive: true;
  encodingFormat: string;
  fileCreatedBy: User;
  fileDateCreated: string;
  fileName: string;
  fileSize: number;
  fileVersion: string;
  url: string;
}

export interface ProjectDocumentMap {
  user: User;
  project: Project;
  document: ProjectDocument;
}
export interface ProjectDocument {
  last_modified?: string;
  url?: string;
  filename?: string;
  version?: string;
  type?: string;
}

export interface UserPermissionMap {
  userPermission: UserPermission;
  permissionsMap: any;
}
export interface UserPermission {
  user_email?: string;
  user_role?: any;
}
