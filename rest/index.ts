import { auth } from './routes/auth';
import { home } from './routes/home';
import { groups } from './routes/groups';

export const routes = [].concat(auth, home, groups);
