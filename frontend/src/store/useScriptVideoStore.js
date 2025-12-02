import { create } from 'zustand';

const useScriptVideoStore = create((set, get) => ({
    // State
    script: '',
    parsedData: null,
    isLoading: false,
    loadingStep: '',
    error: null,
    sessionId: null,
    videoUrl: null,
    progress: null,
    scenes: [],
    language: 'en-US',
    voiceId: 'en-us-male',
    format: '16:9', // Default to YouTube format

    // Actions
    setScript: (script) => set({ script }),
    setLanguage: (language) => set({ language }),
    setVoiceId: (voiceId) => set({ voiceId }),
    setFormat: (format) => set({ format }),

    parseScript: async (script) => {
        set({ isLoading: true, loadingStep: 'Parsing script...', error: null });

        try {
            const response = await fetch('http://localhost:3001/api/script-to-video/parse', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ script })
            });

            if (!response.ok) {
                throw new Error('Failed to parse script');
            }

            const data = await response.json();
            set({
                parsedData: data,
                scenes: data.scenes,
                isLoading: false,
                loadingStep: ''
            });

            return data;
        } catch (error) {
            set({
                error: error.message,
                isLoading: false,
                loadingStep: ''
            });
            throw error;
        }
    },

    generateVideo: async (scenes, title) => {
        set({ isLoading: true, loadingStep: 'Starting generation...', error: null });
        const { language, voiceId, format } = get();

        return new Promise((resolve, reject) => {
            fetch('http://localhost:3001/api/script-to-video/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scenes, title, language, voiceId, format })
            })
                .then(res => res.json())
                .then(data => {
                    const { sessionId } = data;
                    set({ sessionId });

                    const eventSource = new EventSource(`http://localhost:3001/api/script-to-video/progress/${sessionId}`);

                    eventSource.onmessage = (event) => {
                        const data = JSON.parse(event.data);

                        set({
                            progress: data,
                            loadingStep: data.message || ''
                        });

                        if (data.step === 'complete') {
                            set({
                                videoUrl: `http://localhost:3001${data.videoUrl}`,
                                isLoading: false,
                                loadingStep: ''
                            });
                            eventSource.close();
                            resolve(data);
                        } else if (data.step === 'error') {
                            set({
                                error: data.message,
                                isLoading: false,
                                loadingStep: ''
                            });
                            eventSource.close();
                            reject(new Error(data.message));
                        }
                    };

                    eventSource.onerror = () => {
                        set({
                            error: 'Connection lost',
                            isLoading: false
                        });
                        eventSource.close();
                        reject(new Error('Connection lost'));
                    };
                })
                .catch(err => {
                    set({
                        error: err.message,
                        isLoading: false
                    });
                    reject(err);
                });
        });
    },

    replaceScene: async (sceneIndex, file) => {
        const { sessionId } = get();
        if (!sessionId) return;

        set({ isLoading: true, loadingStep: 'Replacing scene...', error: null });

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('sessionId', sessionId);
            formData.append('sceneIndex', sceneIndex);

            const response = await fetch('http://localhost:3001/api/script-to-video/replace-scene', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to replace scene');
            }

            const data = await response.json();
            set({
                videoUrl: `http://localhost:3001${data.videoUrl}`,
                isLoading: false,
                loadingStep: ''
            });

        } catch (error) {
            set({
                error: error.message,
                isLoading: false,
                loadingStep: ''
            });
            throw error;
        }
    },

    reset: () => set({
        script: '',
        parsedData: null,
        isLoading: false,
        loadingStep: '',
        error: null,
        sessionId: null,
        videoUrl: null,
        progress: null,
        scenes: [],
        format: '16:9'
    })
}));

export default useScriptVideoStore;
