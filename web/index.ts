import { home } from './home';
import { auth } from '../user/authRoute';
import { group } from '../steam/group/groupRoute';
import { account } from '../steam/account/accountRoute';

export const routes = [].concat(auth, home, group, account);
