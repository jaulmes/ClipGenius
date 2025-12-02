const axios = require('axios');
const fs = require('fs');

const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;
const PIXABAY_API_URL = 'https://pixabay.com/api/videos/';

async function searchVideos(keywords, duration, limit = 5, orientation = 'landscape') {
    try {
        const query = keywords.join(' ');
        console.log(`[Pixabay] Searching for: "${query}" with orientation: ${orientation}`);

        const response = await axios.get(PIXABAY_API_URL, {
            params: {
                key: PIXABAY_API_KEY,
                q: query,
                per_page: limit,
                video_type: 'all'
            }
        });

        if (!response.data.hits || response.data.hits.length === 0) {
            console.log(`[Pixabay] No videos found for: "${query}"`);
            return [];
        }

        let videos = response.data.hits.map(video => {
            const videoFile = video.videos.large || video.videos.medium || video.videos.small;

            return {
                id: video.id,
                url: videoFile.url,
                width: videoFile.width,
                height: videoFile.height,
                duration: video.duration,
                thumbnail: video.picture_id,
                source: 'pixabay'
            };
        });

        videos = videos.filter(video => {
            const isPortrait = video.height > video.width;
            return orientation === 'portrait' ? isPortrait : !isPortrait;
        });

        videos.sort((a, b) => {
            const diffA = Math.abs(a.duration - duration);
            const diffB = Math.abs(b.duration - duration);
            return diffA - diffB;
        });

        console.log(`[Pixabay] Found ${videos.length} videos with ${orientation} orientation`);
        return videos;
    } catch (error) {
        console.error('[Pixabay] Error:', error.message);
        return [];
    }
}

async function downloadVideo(url, outputPath) {
    try {
        console.log(`[Pixabay] Downloading video to: ${outputPath}`);

        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(outputPath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                console.log(`[Pixabay] Download complete: ${outputPath}`);
                resolve(outputPath);
            });
            writer.on('error', reject);
        });
    } catch (error) {
        console.error('[Pixabay] Download error:', error.message);
        throw error;
    }
}

async function searchMusic(query = 'cinematic') {
    try {
        console.log(`[Pixabay] Searching for music: "${query}"`);

        const response = await axios.get('https://pixabay.com/api/audio/', {
            params: {
                key: PIXABAY_API_KEY,
                q: query,
                per_page: 5,
                category: 'music'
            }
        });

        if (!response.data.hits || response.data.hits.length === 0) {
            console.log(`[Pixabay] No music found for: "${query}"`);
            return [];
        }

        return response.data.hits.map(track => ({
            id: track.id,
            url: track.audio,
            title: track.tags,
            duration: track.duration,
            source: 'pixabay'
        }));
    } catch (error) {
        console.error('[Pixabay] Music search error:', error.message);
        return [];
    }
}

module.exports = {
    searchVideos,
    downloadVideo,
    searchMusic,
    downloadMusic: downloadVideo
};
