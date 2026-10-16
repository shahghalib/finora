// Shared facts used by the public Help, Privacy and Terms pages.

/**
 * The address people can write to for help, data requests and account removal.
 *
 * It is deliberately NOT hard-coded: set NEXT_PUBLIC_CONTACT_EMAIL in .env
 * (and in your hosting provider's environment settings) before going public.
 * While it is empty, the pages fall back to wording that doesn't need an address.
 */
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || null;

/** Bump this whenever the Privacy Policy or Terms of Service text changes. */
export const LEGAL_LAST_UPDATED = '7 October 2026';
