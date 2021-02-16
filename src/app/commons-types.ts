import { Subscription } from 'rxjs';
import { Icon } from './icon';
import { Institution } from './institution';
import { User } from './user';

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

export enum DatasetType {
  'Generic' = 'Generic',
  'DICOM' = 'DICOM',
  'REDCap' = 'REDCap',
}

export interface Dataset {
  id?: string;
  dataset_type: DatasetType;
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
  study_irb_number?: string;
  approved_irb_link?: string;
  contract_link?: string;
  link_to_external_dataset?: string;
  dicom_de_identified?: string;
  dicom_bids_structure?: string;
  dicom_quality?: string;
  dicom_study_date?: string;
  dicom_scanner_manufacturer_name?: string;
  dicom_scanner_model_name?: string;
  dicom_organ_name?: string;
  dicom_fieldof_view?: string;
  dicom_field_strength?: string;
  redcap_project_url?: string;
  redcap_extract_data?: string;
  redcap_refresh_rate?: number;
  redcap_report_id?: string;
  redcap_project_token?: string;
  redcap_project_title?: string;
  redcap_project_pi?: string;
  is_hsd?: boolean;
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
  isDataset: boolean;
  hasIrbNumber?: boolean;
  irbInvestigators?: IrbInvestigator[];
}

export interface UserPermission {
  user_email?: string;
  user_role?: any;
}

export interface IrbInvestigator {
  email: string;
  type: IrbInvestigatorType;
  type_full: IrbInvestigatorTypeLabel;
}

export interface IrbNumber {
  study_id: string;
}

/**
 * 1. Principal Investigator
 * 2. Study Coordinator I
 * 3. Study Coordinator II
 * 4. Additional Study Coordinator
 * 5. IRB Coordinator
 * 6. Sub-Investigator
 */
export enum IrbInvestigatorType {
  'PI' = 'PI',
  'SI' = 'SI',
  'DC' = 'DC',
  'SC_I' = 'SC_I',
  'SC_II' = 'SC_II',
  'AS_C' = 'AS_C',
  'DEPT_CH' = 'DEPT_CH',
  'IRBC' = 'IRBC',
  'SCI' = 'SCI',
}

export enum IrbInvestigatorTypeLabel {
  'PI' = 'Primary Investigator',
  'SI' = 'Sub Investigator',
  'DC' = 'Department Contact',
  'SC_I' = 'Study Coordinator 1',
  'SC_II' = 'Study Coordinator 2',
  'AS_C' = 'Additional Study Coordinators',
  'DEPT_CH' = 'Department Chair',
  'IRBC' = 'IRB Coordinator',
  'SCI' = 'Scientific Contact',
}
