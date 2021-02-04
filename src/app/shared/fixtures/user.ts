import { User } from '../../user';
import { mockInstitution } from './institution';

export function getDummyUser(): User {
  return {
    id: 123,
    email: 'wicket@endor.gov',
    display_name: 'Wicket the Ewok',
    role: 'User'
  };
}

export const mockUser: User = {
  id: 0,
  eppn: 'mock_eppn@whatever.edu',
  email: 'mock_email@whatever.edu',
  display_name: '',
  role: '',
  institutional_role: '',
  division: '',
  institution_id: 0,
  institution: mockInstitution,
};
