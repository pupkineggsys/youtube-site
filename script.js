// YouTubeチャンネル設定
const CHANNEL_ID = 'UCD-KiPyXa3YXGPijH2mDJXg';

// 動画コンテナ
const videoContainer = document.getElementById('video-container');

// ページ読み込み完了時に実行
window.onload = function() {
    loadVideos();
};

// 動画を読み込む
function loadVideos() {
    const apiUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?channel_id=' + CHANNEL_ID;

    fetch(apiUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            if (data.status === 'ok' && data.items) {
                showVideos(data.items);
            } else {
                showError();
            }
        })
        .catch(function(error) {
            showError();
        });
}

// 動画を表示
function showVideos(videos) {
    var html = '';

    for (var i = 0; i < videos.length; i++) {
        var video = videos[i];
        var videoId = getVideoId(video.link);

        if (videoId) {
            html += '<a class="video-card" href="' + video.link + '" target="_blank">';
            html += '<div class="video-thumbnail">';
            html += '<img src="https://i.ytimg.com/vi/' + videoId + '/hqdefault.jpg" alt="' + video.title + '">';
            html += '</div>';
            html += '<div class="video-info">';
            html += '<h3 class="video-title">' + video.title + '</h3>';
            html += '</div>';
            html += '</a>';
        }
    }

    videoContainer.innerHTML = html;
}

// 動画IDを取得
function getVideoId(link) {
    var match = link.match(/watch\?v=([^&]+)/);
    return match ? match[1] : null;
}

// エラー表示
function showError() {
    videoContainer.innerHTML = '<div style="text-align:center;color:white;padding:40px;"><p>動画の読み込みに失敗しました</p><a href="https://www.youtube.com/@ikumin" target="_blank" style="color:#feca57;">YouTubeで見る</a></div>';
}
