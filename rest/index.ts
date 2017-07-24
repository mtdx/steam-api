import { auth } from '../user/auth.routes';
import { home } from './home';
import { groups } from '../steam/group/routes';

export const routes = [].concat(auth, home, groups);
