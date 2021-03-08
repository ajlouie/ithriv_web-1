import { Availability } from './availability';
import { Favorite } from './favorite';
import { FileAttachment } from './file-attachment';
import { Institution } from './institution';
import { Links } from './links';
import { ResourceCategory } from './resource-category';
import { ResourceType } from './resourceType';
import { SegmentType } from './segmentType';

export interface Resource {
  id: number;
  name: string;
  description: string;
  owner?: string;
  owners?: string[];
  contact_email?: string;
  contact_notes?: string;
  contact_phone?: string;
  cost?: string;
  favorite_count?: number;
  institution_id?: number;
  type_id?: number;
  website?: string;
  approved?: string;
  files?: FileAttachment[];
  private?: boolean;
  event_date?: string;
  starts?: string;
  ends?: string;
  location?: string;
  user_may_view?: boolean;
  user_may_edit?: boolean;
  last_updated?: string;
  favorites?: Favorite[];
  availabilities?: Availability[];
  institution?: Institution;
  type?: ResourceType;
  segment?: SegmentType;
  segment_id?: number;
  _links?: Links;
  resource_categories?: ResourceCategory[];
}
