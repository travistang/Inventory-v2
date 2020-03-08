import { BaseName } from './routes';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory({basename: BaseName });

export default history;