import { TokenPayload } from '../utils/tokens.js';

declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}
