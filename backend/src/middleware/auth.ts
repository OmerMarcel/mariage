import { NextFunction, Request, Response } from 'express';
import { getAuth } from 'firebase-admin/auth';
import { getApps } from 'firebase-admin/app';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
  };
}

export async function requireAdmin(
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authorization = request.header('authorization');
    const token = authorization?.startsWith('Bearer ')
      ? authorization.slice('Bearer '.length)
      : undefined;

    if (!token || getApps().length === 0) {
      response.status(401).json({ error: 'Authentification administrateur requise.' });
      return;
    }

    const decodedToken = await getAuth().verifyIdToken(token);
    const configuredEmails = (process.env.ADMIN_EMAILS ?? '')
      .split(',')
      .map(email => email.trim().toLowerCase())
      .filter(Boolean);
    const isAdminClaim = decodedToken.admin === true;
    const isAllowedEmail = Boolean(
      decodedToken.email && configuredEmails.includes(decodedToken.email.toLowerCase()),
    );

    if (!isAdminClaim && !isAllowedEmail) {
      response.status(403).json({ error: 'Droits administrateur insuffisants.' });
      return;
    }

    request.user = { uid: decodedToken.uid, email: decodedToken.email };
    next();
  } catch (error: any) {
    if (error?.code?.startsWith('auth/') || error?.message?.includes('token')) {
      response.status(401).json({ error: 'Session invalide ou expirée.' });
      return;
    }
    next(error);
  }
}
