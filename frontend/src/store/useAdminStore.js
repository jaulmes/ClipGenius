import { create } from 'zustand';

const useAdminStore = create((set, get) => ({
    artists: [],
    loading: false,
    error: null,

    fetchArtists: async () => {
        set({ loading: true, error: null });
        try {
            const res = await fetch('http://localhost:3001/api/admin/artists');
            const data = await res.json();
            set({ artists: data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    createArtist: async (name) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch('http://localhost:3001/api/admin/artists', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            });
            const data = await res.json();

            if (!data.success) throw new Error(data.error);

            await get().fetchArtists();
            set({ loading: false });
            return data.artistId;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    uploadMedia: async (artistId, files) => {
        set({ loading: true, error: null });
        try {
            const formData = new FormData();
            Array.from(files).forEach(file => {
                formData.append('files', file);
            });

            const res = await fetch(`http://localhost:3001/api/admin/artists/${artistId}/media`, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (!data.success) throw new Error(data.error);

            await get().fetchArtists();
            set({ loading: false });
            return data.added;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    deleteArtist: async (artistId) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch(`http://localhost:3001/api/admin/artists/${artistId}`, {
                method: 'DELETE'
            });
            const data = await res.json();

            if (!data.success) throw new Error(data.error);

            await get().fetchArtists();
            set({ loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    }
}));

export default useAdminStore;
