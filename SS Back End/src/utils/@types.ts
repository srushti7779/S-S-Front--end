import { Request as ExpressRequest } from 'express';
import { Admin } from '../app/models/admin';
import { UserAuth } from '../app/models/UserAuth';

export interface Request extends ExpressRequest {
    user?: number,
    admin?: Admin
}