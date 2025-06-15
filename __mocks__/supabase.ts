
import { vi } from 'vitest';

// Add storage and correct mock methods for table queries as well
export const supabase = {
    auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
        signUp: vi.fn().mockResolvedValue({ data: { user: {}, session: {} }, error: null }),
        signInWithPassword: vi.fn().mockResolvedValue({ data: { session: { user: { email: 'test@example.com' } } }, error: null }),
        resetPasswordForEmail: vi.fn().mockResolvedValue({ error: null }),
        resend: vi.fn().mockResolvedValue({}),
    },

    from: vi.fn((table) => ({
        select: vi.fn(() => ({
            eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                    data: { username: 'testuser', full_name: 'Test User' },
                }),
                maybeSingle: vi.fn().mockResolvedValue({ data: null }),
            })),
            maybeSingle: vi.fn().mockResolvedValue({ data: null }),
        })),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null }),
        single: vi.fn().mockResolvedValue({ data: { username: 'testuser', full_name: 'Test User' } }),
    })),

    storage: {
        from: vi.fn(() => ({
            upload: vi.fn().mockResolvedValue({
                data: { path: 'test-path' },
                error: null
            }),
            getPublicUrl: vi.fn((path) => ({
                data: { publicUrl: 'https://example.com/' + path },
            })),
        })),
    },
};
