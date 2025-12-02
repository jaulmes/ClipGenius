import { create } from 'zustand';

const useCelebrityStore = create((set, get) => ({
    script: '',
    analysis: null,
    sessionId: null,
    progress: { step: 'init', percent: 0, message: '' },
    videoUrl: null,
    loading: false,
    error: null,

    setScript: (script) => set({ script }),

    analyzeScript: async () => {
        const { script } = get();
        set({ loading: true, error: null });

        try {
            const res = await fetch('http://localhost:3001/api/celebrity-video/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ script })
            });
            const data = await res.json();
            set({ analysis: data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    generateVideo: async (language = 'en-US') => {
        const { script } = get();
        set({ loading: true, error: null, videoUrl: null });

        try {
            const res = await fetch('http://localhost:3001/api/celebrity-video/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ script, language })
            });
            const data = await res.json();

            set({ sessionId: data.sessionId, loading: false });
            get().subscribeToProgress(data.sessionId);
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    subscribeToProgress: (sessionId) => {
        const eventSource = new EventSource(`http://localhost:3001/api/celebrity-video/progress/${sessionId}`);

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            set({ progress: data });

            if (data.step === 'complete') {
                set({ videoUrl: data.videoUrl });
                eventSource.close();
            } else if (data.step === 'error') {
                set({ error: data.message });
                eventSource.close();
            }
        };

        eventSource.onerror = () => {
            eventSource.close();
            set({ error: 'Connection perdue avec le serveur' });
        };
    },

    reset: () => set({
        script: '',
        analysis: null,
        sessionId: null,
        progress: { step: 'init', percent: 0, message: '' },
        videoUrl: null,
        loading: false,
        error: null
    })
}));

export default useCelebrityStore;
