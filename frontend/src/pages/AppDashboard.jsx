import { useVideoStore } from '../store/useVideoStore';
import Dashboard from '../components/Dashboard';
import VideoEditor from '../components/VideoEditor';

export default function AppDashboard() {
    const currentProject = useVideoStore(state => state.getCurrentProject());

    // A project is considered "active" for the editor view if its status is 'Completed'.
    const showEditor = currentProject && currentProject.status === 'Completed';

    return (
        <div className="bg-gray-900 min-h-screen text-white font-sans">
            {showEditor ? <VideoEditor /> : <Dashboard />}
        </div>
    );
}
