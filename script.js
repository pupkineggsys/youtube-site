// YouTubeチャンネル設定
const CHANNEL_ID = 'UCD-KiPyXa3YXGPijH2mDJXg';
const CHANNEL_URL = 'https://www.youtube.com/@ikumin';

// RSS to JSON API
const RSS_API = `https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

// 動画コンテナ
const videoContainer = document.getElementById('video-container');

// 日付をフォーマット
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}/${month}/${day}`;
}

// 動画IDをURLから取得
function getVideoId(link) {
    const match = link.match(/watch\?v=([^&]+)/);
    return match ? match[1] : null;
}

// 動画カードを作成
function createVideoCard(video) {
    const videoId = getVideoId(video.link);
    if (!videoId) return null;

    const card = document.createElement('a');
    card.className = 'video-card';
    card.href = video.link;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';

    card.innerHTML = `
        <div class="video-thumbnail">
            <img src="https://i.ytimg.com/vi/${videoId}/hqdefault.jpg" alt="${video.title}" loading="lazy">
        </div>
        <div class="video-info">
            <h3 class="video-title">${video.title}</h3>
            <p class="video-date">${formatDate(video.pubDate)}</p>
        </div>
    `;

    return card;
}

// エラー時のフォールバック表示
function showFallback() {
    videoContainer.innerHTML = `
        <div class="fallback-content">
            <p>最新動画はYouTubeでチェック！</p>
            <a href="${CHANNEL_URL}" target="_blank" class="youtube-link-btn">
                YouTubeチャンネルを見る
            </a>
        </div>
        <style>
            .fallback-content {
                grid-column: 1 / -1;
                text-align: center;
                padding: 40px 20px;
                background: rgba(255,255,255,0.1);
                border-radius: 20px;
            }
            .fallback-content p {
                color: white;
                font-size: 1.2rem;
                margin-bottom: 20px;
            }
            .youtube-link-btn {
                display: inline-block;
                background: linear-gradient(135deg, #ff0000, #cc0000);
                color: white;
                padding: 15px 40px;
                border-radius: 50px;
                text-decoration: none;
                font-weight: bold;
                font-size: 1.1rem;
                box-shadow: 0 5px 20px rgba(255,0,0,0.4);
                transition: transform 0.3s ease;
            }
            .youtube-link-btn:hover {
                transform: translateY(-3px);
            }
        </style>
    `;
}

// 動画を読み込んで表示
async function loadVideos() {
    try {
        console.log('動画を読み込み中...');

        const response = await fetch(RSS_API);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        console.log('取得したデータ:', data);

        if (data.status !== 'ok') {
            throw new Error('RSS取得エラー: ' + (data.message || 'Unknown error'));
        }

        // コンテナをクリア
        videoContainer.innerHTML = '';

        // 動画がない場合
        if (!data.items || data.items.length === 0) {
            showFallback();
            return;
        }

        // 各動画をカードとして追加
        data.items.forEach(video => {
            const card = createVideoCard(video);
            if (card) {
                videoContainer.appendChild(card);
            }
        });

        console.log(`${data.items.length}件の動画を表示しました`);

    } catch (error) {
        console.error('動画読み込みエラー:', error);
        showFallback();
    }
}

// ページ読み込み時に動画を取得
document.addEventListener('DOMContentLoaded', function() {
    console.log('ページ読み込み完了、動画取得開始');
    loadVideos();
});
