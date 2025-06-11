import { vi } from 'vitest';
export const supabase = {
    auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
        signUp: vi.fn().mockResolvedValue({ data: { user: {}, session: {} }, error: null }),
        signInWithPassword: vi.fn().mockResolvedValue({ data: { session: { user: { email: 'test@example.com' } } }, error: null }),
        resetPasswordForEmail: vi.fn().mockResolvedValue({ error: null }),
        resend: vi.fn().mockResolvedValue({}),
    },
    from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null }),
    })),
};
