
import { vi } from 'vitest';

const mockSession = { user: { id: 'test-user-id', email: 'test@example.com' } };

export const supabase = {
  auth: {
    getSession: vi.fn().mockResolvedValue({ data: { session: mockSession } }),
    signUp: vi.fn().mockResolvedValue({ data: { user: {}, session: {} }, error: null }),
    signInWithPassword: vi.fn().mockResolvedValue({ data: { session: mockSession }, error: null }),
    resetPasswordForEmail: vi.fn().mockResolvedValue({ error: null }),
    resend: vi.fn().mockResolvedValue({}),
  },
  from: vi.fn((table) => {
    switch (table) {
      case 'profiles':
        return {
          select: vi.fn(() => ({
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: { username: 'testuser', full_name: 'Test User', avatar_url: '', bio: 'Tester Bio' },
            }),
            maybeSingle: vi.fn().mockResolvedValue({ data: null }),
          })),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({
            data: { username: 'testuser', full_name: 'Test User', avatar_url: '', bio: 'Tester Bio' },
          }),
          maybeSingle: vi.fn().mockResolvedValue({ data: null }),
        };
      case 'profile_settings':
        return {
          select: vi.fn(() => ({
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: {
                links: [
                  {
                    id: '1',
                    title: 'Test Link',
                    url: 'https://test.com',
                    icon: 'link',
                    display: 'both',
                    photo_url: '',
                  },
                ],
                theme_id: 'elegant',
                font_style: 'sans',
                layout_type: 'links',
                animation_type: 'fade',
                favicon_url: '',
                is_dark_mode: false,
                text_shadow: false,
              },
            }),
            maybeSingle: vi.fn().mockResolvedValue({ data: null }),
          })),
          eq: vi.fn().mockReturnThis(),
          update: vi.fn().mockResolvedValue({ data: {}, error: null }),
          insert: vi.fn().mockResolvedValue({ data: {}, error: null }),
          single: vi.fn().mockResolvedValue({
            data: {
              links: [
                {
                  id: '1',
                  title: 'Test Link',
                  url: 'https://test.com',
                  icon: 'link',
                  display: 'both',
                  photo_url: '',
                },
              ],
            },
          }),
          maybeSingle: vi.fn().mockResolvedValue({ data: null }),
        };
      case 'link-photos':
        return {
          // Used for .remove
          remove: vi.fn().mockResolvedValue({ error: null }),
        };
      default:
        // fallback for other tables
        return {
          select: vi.fn(() => ({
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: {} }),
            maybeSingle: vi.fn().mockResolvedValue({ data: null }),
          })),
          eq: vi.fn().mockReturnThis(),
          update: vi.fn().mockResolvedValue({ data: {}, error: null }),
          insert: vi.fn().mockResolvedValue({ data: {}, error: null }),
          remove: vi.fn().mockResolvedValue({ error: null }),
          single: vi.fn().mockResolvedValue({ data: {} }),
          maybeSingle: vi.fn().mockResolvedValue({ data: null }),
        };
    }
  }),
  storage: {
    from: vi.fn((bucket) => ({
      upload: vi.fn().mockImplementation((path, file) =>
        Promise.resolve({
          data: { path: path },
          error: null,
        })
      ),
      getPublicUrl: vi.fn((path) => ({
        data: { publicUrl: `https://example.com/${path}` },
      })),
      remove: vi.fn().mockResolvedValue({ error: null }),
    })),
  },
};
