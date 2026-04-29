type HeaderValue = string | string[] | undefined;

const extractTokenFromHeader = (value: HeaderValue): string | null => {
  if (!value) return null;

  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return null;

  const normalized = raw.trim().replace(/^['"]|['"]$/g, '');
  if (!normalized) return null;

  if (/^Bearer\s+/i.test(normalized)) {
    const bearerToken = normalized.replace(/^Bearer\s+/i, '').trim();
    return bearerToken || null;
  }

  return normalized;
};

export const getAuthToken = (request: any): string | null => {
  const headers = request?.headers ?? {};

  const tokenCandidates: HeaderValue[] = [
    headers.authorization,
    headers.Authorization,
    headers['x-access-token'],
    headers['access-token'],
    headers.accesstoken,
    headers.token,
    request?.body?.authorization,
    request?.body?.accessToken,
  ];

  for (const candidate of tokenCandidates) {
    const token = extractTokenFromHeader(candidate);
    if (token) return token;
  }

  return null;
};
