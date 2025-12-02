const axios = require('axios');
const fs = require('fs');

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const PEXELS_API_URL = 'https://api.pexels.com/videos';

async function searchVideos(keywords, duration, limit = 5, orientation = 'landscape') {
    try {
        const query = keywords.join(' ');
        console.log(`[Pexels] Searching for: "${query}" with orientation: ${orientation}`);

        const response = await axios.get(`${PEXELS_API_URL}/search`, {
            headers: {
                'Authorization': PEXELS_API_KEY
            },
            params: {
                query,
                per_page: limit,
                orientation: orientation
            }
        });

        if (!response.data.videos || response.data.videos.length === 0) {
            console.log(`[Pexels] No videos found for: "${query}"`);
            return [];
        }

        const videos = response.data.videos.map(video => {
            const hdFile = video.video_files.find(f => f.quality === 'hd' && f.width >= 1280) ||
                video.video_files.find(f => f.quality === 'sd') ||
                video.video_files[0];

            return {
                id: video.id,
                url: hdFile.link,
                width: video.width,
                height: video.height,
                duration: video.duration,
                thumbnail: video.image,
                source: 'pexels'
            };
        });

        videos.sort((a, b) => {
            const diffA = Math.abs(a.duration - duration);
            const diffB = Math.abs(b.duration - duration);
            return diffA - diffB;
        });

        console.log(`[Pexels] Found ${videos.length} videos`);
        return videos;
    } catch (error) {
        console.error('[Pexels] Error:', error.message);
        return [];
    }
}

async function downloadVideo(url, outputPath) {
    try {
        console.log(`[Pexels] Downloading video to: ${outputPath}`);

        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(outputPath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                console.log(`[Pexels] Download complete: ${outputPath}`);
                resolve(outputPath);
            });
            writer.on('error', reject);
        });
    } catch (error) {
        console.error('[Pexels] Download error:', error.message);
        throw error;
    }
}

async function getPopularVideos(limit = 10) {
    try {
        const response = await axios.get(`${PEXELS_API_URL}/popular`, {
            headers: {
                'Authorization': PEXELS_API_KEY
            },
            params: {
                per_page: limit
            }
        });

        return response.data.videos || [];
    } catch (error) {
        console.error('[Pexels] Error fetching popular videos:', error.message);
        return [];
    }
}

module.exports = {
    searchVideos,
    downloadVideo,
    getPopularVideos
};
