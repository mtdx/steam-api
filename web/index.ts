import { home } from './home';
import { auth } from '../user/authRoute';
import { group } from '../steam/group/groupRoute';
import { account } from '../steam/account/accountRoute';
import { error } from '../steam/error/errorRoute';

export const routes = [].concat(auth, home, group, account, error);
