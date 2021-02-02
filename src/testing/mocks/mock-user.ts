import { User } from '../../app/user';

export const mockUser: User = {
  id: 0,
  eppn: 'mock_eppn@whatever.edu',
  email: 'mock_email@whatever.edu',
  display_name: '',
  role: '',
  institutional_role: '',
  division: '',
  institution_id: 0,
  institution: {
    id: 0,
    name: 'Mock User',
    description: 'A fake person for testing',
  }
};
