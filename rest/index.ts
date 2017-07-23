import { auth } from './auth/routes';
import { home } from './home/routes';

export const routes = [].concat(auth, home);
