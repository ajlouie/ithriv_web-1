import { Icon } from './icon';
import { Institution } from './institution';
export interface Project {
  id?: string;
  collab_mgmt_service_id?: string;
  name?: string;
  name_alts?: string;
  pl_pi?: string;
  description?: string;
  keywords?: string;
  funding_source?: string;
  ithriv_partner?: string;
  other_partner?: string;
  owners: Array<string>;
  collaborators: Array<string>;
  private?: boolean;
  institution?: Institution;
  icon?: Icon;
}