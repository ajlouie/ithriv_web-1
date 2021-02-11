import { Dataset, DatasetType } from '../../commons-types';
import { mockInstitution } from './institution';

export const mockDataset: Dataset = {
  dataset_type: DatasetType.Generic,
  can_delete_data: false,
  can_delete_meta: false,
  can_download_data: false,
  can_manage_permission: false,
  can_restore_data: false,
  can_update_meta: false,
  can_upload_data: false,
  institution: mockInstitution,
  keywords: 'some keywords',
};
