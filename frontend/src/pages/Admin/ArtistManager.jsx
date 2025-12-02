import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAdminStore from '../../store/useAdminStore';

export default function ArtistManager() {
    const navigate = useNavigate();
    const { artists, loading, error, fetchArtists, createArtist, uploadMedia, deleteArtist } = useAdminStore();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newArtistName, setNewArtistName] = useState('');
    const [selectedArtist, setSelectedArtist] = useState(null);
    const [uploadFiles, setUploadFiles] = useState([]);

    useEffect(() => {
        fetchArtists();
    }, []);

    const handleCreateArtist = async () => {
        try {
            await createArtist(newArtistName);
            setShowCreateModal(false);
            setNewArtistName('');
        } catch (err) {
            alert(err.message);
        }
    };

    const handleUploadMedia = async () => {
        if (!selectedArtist || uploadFiles.length === 0) return;

        try {
            const stats = await uploadMedia(selectedArtist, uploadFiles);
            alert(`Ajouté: ${stats.images} images, ${stats.videos} vidéos ✅`);
            setSelectedArtist(null);
            setUploadFiles([]);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async (artistId) => {
        if (!confirm('Supprimer cet artiste et tous ses médias ?')) return;
        try {
            await deleteArtist(artistId);
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">🎬 Gestion des Artistes</h1>
                    <button
                        onClick={() => navigate('/')}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                    >
                        ← Retour
                    </button>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="p-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow-lg hover:shadow-xl"
                    >
                        <div className="text-3xl mb-2">➕</div>
                        <div className="font-bold">Créer un Nouvel Artiste</div>
                    </button>
                    <button
                        onClick={() => setSelectedArtist('select')}
                        className="p-6 bg-green-500 text-white rounded-lg hover:bg-green-600 transition shadow-lg hover:shadow-xl"
                    >
                        <div className="text-3xl mb-2">📤</div>
                        <div className="font-bold">Ajouter des Médias</div>
                    </button>
                </div>

                {/* Liste artistes */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold mb-4">Artistes ({artists.length})</h2>
                    {loading && <p className="text-gray-600">Chargement...</p>}
                    {error && <p className="text-red-500 bg-red-50 p-3 rounded">{error}</p>}

                    {artists.length === 0 && !loading && (
                        <p className="text-gray-500 text-center py-8">
                            Aucun artiste pour le moment. Créez-en un pour commencer !
                        </p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {artists.map(artist => (
                            <div key={artist.id} className="border rounded-lg p-4 hover:shadow-md transition">
                                <h3 className="font-bold text-lg mb-2">{artist.name}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                    <span>📷 {artist.imageCount} images</span>
                                    <span>•</span>
                                    <span>🎥 {artist.videoCount} vidéos</span>
                                </div>
                                <p className="text-xs text-gray-400 mb-3">
                                    Créé le {new Date(artist.createdAt).toLocaleDateString('fr-FR')}
                                </p>
                                <button
                                    onClick={() => handleDelete(artist.id)}
                                    className="text-red-600 text-sm hover:underline"
                                >
                                    🗑️ Supprimer
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Modal Créer Artiste */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl">
                            <h2 className="text-2xl font-bold mb-4">Créer un Nouvel Artiste</h2>
                            <input
                                type="text"
                                value={newArtistName}
                                onChange={(e) => setNewArtistName(e.target.value)}
                                placeholder="Nom de l'artiste (ex: Michael Jackson)"
                                className="w-full border rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onKeyPress={(e) => e.key === 'Enter' && handleCreateArtist()}
                            />
                            <div className="flex gap-4">
                                <button
                                    onClick={handleCreateArtist}
                                    disabled={!newArtistName.trim()}
                                    className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-300 transition"
                                >
                                    Créer
                                </button>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400 transition"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal Sélection Artiste */}
                {selectedArtist === 'select' && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl">
                            <h2 className="text-2xl font-bold mb-4">Sélectionner un Artiste</h2>
                            <select
                                onChange={(e) => setSelectedArtist(e.target.value)}
                                className="w-full border rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">-- Choisir un artiste --</option>
                                {artists.map(artist => (
                                    <option key={artist.id} value={artist.id}>
                                        {artist.name} ({artist.imageCount} images, {artist.videoCount} vidéos)
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={() => setSelectedArtist(null)}
                                className="w-full bg-gray-300 py-2 rounded hover:bg-gray-400 transition"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                )}

                {/* Modal Upload Médias */}
                {selectedArtist && selectedArtist !== 'select' && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl">
                            <h2 className="text-2xl font-bold mb-4">Upload Médias</h2>
                            <p className="text-sm text-gray-600 mb-3">
                                Artiste: <strong>{artists.find(a => a.id === selectedArtist)?.name}</strong>
                            </p>
                            <input
                                type="file"
                                multiple
                                accept="image/*,video/*"
                                onChange={(e) => setUploadFiles(e.target.files)}
                                className="w-full mb-4 text-sm"
                            />
                            <p className="text-sm text-gray-600 mb-4">
                                {uploadFiles.length} fichier(s) sélectionné(s)
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={handleUploadMedia}
                                    className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:bg-gray-300 transition"
                                    disabled={uploadFiles.length === 0}
                                >
                                    Upload
                                </button>
                                <button
                                    onClick={() => { setSelectedArtist(null); setUploadFiles([]); }}
                                    className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400 transition"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
