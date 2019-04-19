import { Links } from './links';
import { Category } from './category';

export interface ResourceCategory {
  id: number;
  category_id: number;
  resource_id: number;
  category: Category;
  _links: Links;
}
