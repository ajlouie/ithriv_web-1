import { Project } from '../../commons-types';

export const mockProject: Project = {
  id: 'string',
  collab_mgmt_service_id: 'string',
  name: 'string',
  name_alts: 'string',
  pl_pi: 'string',
  description: 'string',
  keywords: 'string',
  funding_source: 'string',
  partners: 'string',
  owners: [],
  collaborators: [],
  private: true,
  institution: {
    id: 0,
    name: 'string',
    description: 'string',
  },
  icon: {
    id: 0,
    name: 'string',
    url: 'https://some.url.com',
  },
  can_delete_data: false,
  can_delete_meta: false,
  can_download_data: false,
  can_manage_permission: false,
  can_update_meta: false,
  can_upload_data: false,
  documents: [
    {
      last_modified: '2021-02-04T18:51:38.071Z',
      url: 'https://some.url.com',
      filename: 'string.csv',
      version: '1.0',
      type: 'IRB Approval',
    }
  ],
  web_page_url: 'string',
};
