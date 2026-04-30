import { createCookie } from 'react-router'

export const sessionCookie = createCookie('__session', {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
})

export async function getSessionToken(
  request: Request,
): Promise<string | null> {
  const token = await sessionCookie.parse(request.headers.get('Cookie'))
  return typeof token === 'string' ? token : null
}
