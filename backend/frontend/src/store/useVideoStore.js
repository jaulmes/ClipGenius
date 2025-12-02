// frontend/src/store/useVideoStore.js
import { create } from 'zustand';

const API_URL = 'http://localhost:3001';

export const useVideoStore = create((set, get) => ({
  // STATE
  projects: [],
  currentProjectId: null,
  isLoading: false,
  error: null,
  processingProgress: {
    step: 'waiting',
    percent: 0,
    message: '',
  },

  // GETTERS
  getCurrentProject: () => {
    const { projects, currentProjectId } = get();
    return projects.find(p => p.id === currentProjectId) || null;
  },

  getSelectedClip: () => {
    const project = get().getCurrentProject();
    const selectedClipId = get().selectedClipId;
    if (!project || !selectedClipId) return null;
    return project.clips.find(c => c.id === selectedClipId);
  },

  // ACTIONS
  startNewProject: async (youtubeUrl, transcriptionMethod) => {
    set({
      isLoading: true,
      error: null,
      processingProgress: { step: 'waiting', percent: 0, message: 'Initialisation...' }
    });

    // Création d'un ID temporaire pour l'UI immédiate
    const tempId = `proj_${Date.now()}`;
    const newProjectStub = {
      id: tempId,
      sourceUrl: youtubeUrl,
      status: 'Processing',
      clips: [],
      title: 'Processing video...'
    };

    set(state => ({
      projects: [newProjectStub, ...state.projects],
      currentProjectId: newProjectStub.id,
    }));

    try {
      // 1. Démarrer le traitement et obtenir l'ID de session
      const response = await fetch(`${API_URL}/api/process-video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtubeUrl, transcriptionMethod }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.details || 'Backend request failed.');
      }

      const { sessionId } = await response.json();

      // 2. Se connecter au flux SSE pour la progression
      const eventSource = new EventSource(`${API_URL}/api/progress/${sessionId}`);

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);

        // Mise à jour de la progression
        set({ processingProgress: data });

        // Si terminé
        if (data.step === 'complete') {
          const finishedProject = {
            ...newProjectStub,
            id: sessionId, // On utilise le vrai ID de session
            status: 'Completed',
            clips: data.clips,
            title: data.title,
            sourceUrl: data.sourceUrl,
          };

          set(state => ({
            // Remplacer le stub par le projet fini
            projects: state.projects.map(p => p.id === tempId ? finishedProject : p),
            currentProjectId: sessionId,
            isLoading: false,
            processingProgress: { step: 'complete', percent: 100, message: 'Terminé !' }
          }));

          if (data.clips && data.clips.length > 0) {
            get().selectClip(data.clips[0].id);
          }

          eventSource.close();
        }

        // Si erreur
        if (data.step === 'error') {
          set({ error: data.message, isLoading: false });
          set(state => ({
            projects: state.projects.filter(p => p.id !== tempId)
          }));
          eventSource.close();
        }
      };

      eventSource.onerror = () => {
        // Ne pas traiter comme une erreur fatale immédiatement, SSE tente de se reconnecter
        // Mais si ça persiste, on peut fermer
        // Pour l'instant on laisse gérer par le navigateur ou on log
        console.log('SSE connection issue...');
      };

    } catch (e) {
      console.error("Error processing project:", e);
      set({ error: e.message, isLoading: false });
      set(state => ({
        projects: state.projects.filter(p => p.id !== tempId)
      }));
    }
  },

  selectedClipId: null,
  selectClip: (clipId) => set({ selectedClipId: clipId }),

  updateSubtitleText: (clipId, newTranscript) => {
    console.log(`Updating transcript for clip ${clipId}:`, newTranscript);
  },
}));
