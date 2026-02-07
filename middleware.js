// Saturno Vault — protect bonus content behind auth cookie

import { next } from '@vercel/functions';

function getCookie(request, name) {
  const header = request.headers.get('cookie') || '';
  const match = header.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export default function middleware(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  const needsAuth =
    path === '/bonus.html' ||
    path === '/bonus' ||
    path === '/vault' ||
    path.startsWith('/tools/cf4-full-program-bonus/');

  if (!needsAuth) {
    return next();
  }

  const token = process.env.VAULT_TOKEN;
  const cookie = getCookie(request, 'vault_auth');

  if (!token || cookie !== token) {
    return Response.redirect(new URL('/gate.html', request.url));
  }

  return next();
}

export const config = {
  matcher: ['/bonus.html', '/bonus', '/tools/cf4-full-program-bonus/:path*'],
};
