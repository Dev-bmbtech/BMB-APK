const API_BASE_URL = 'https://api.giftedtech.co.ke/api/download/apkdl';
const API_KEY = 'gifted';

// Popular trending apps
const TRENDING_APPS = [
    'WhatsApp', 'Instagram', 'TikTok', 'Facebook', 'Spotify', 
    'Netflix', 'YouTube', 'Snapchat', 'Telegram', 'Twitter',
    'CapCut', 'Gmail', 'Google Maps', 'Uber', 'Amazon',
    'Discord', 'Zoom', 'Microsoft Teams', 'LinkedIn', 'Pinterest',
    'Reddit', 'Tinder', 'WhatsApp Business', 'Signal', 'Viber',
    'LINE', 'WeChat', 'Alipay', 'PayPal', 'Cash App',
    'Adobe Lightroom', 'Canva', 'Duolingo', 'Candy Crush', 'Subway Surfers',
    'Among Us', 'Call of Duty', 'Free Fire', 'PUBG Mobile', 'Minecraft',
    'Roblox', 'Brawl Stars', 'Clash of Clans', 'Clash Royale', 'Pokémon GO',
    'Telegram X', 'Firefox', 'Chrome', 'Opera', 'Samsung Internet',
    'Microsoft Edge', 'VLC', 'MX Player', 'PowerDirector', 'Kinemaster',
    'TikTok Lite', 'Facebook Lite', 'Instagram Lite', 'Messenger', 'Discord Canary',
    'Twitch', 'Tumblr', 'Quora', 'Medium', 'Telegram Beta',
    'WhatsApp Beta', 'Google Photos', 'Google Drive', 'Dropbox', 'OneDrive',
    'Adobe Acrobat', 'Microsoft Word', 'Microsoft Excel', 'Microsoft PowerPoint', 'WPS Office',
    'Trello', 'Slack', 'Asana', 'Notion', 'Evernote',
    'Spotify Lite', 'Deezer', 'SoundCloud', 'Shazam', 'Amazon Music',
    'Google News', 'BBC News', 'CNN', 'Al Jazeera', 'The Guardian',
    'Weather', 'AccuWeather', 'MyFitnessPal', 'Strava', 'Nike Run Club',
    'Headspace', 'Calm', 'Medito', 'Yoga for Beginners', 'Daily Burn'
];

let currentDownloading = null;

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadTrendingApps();
    setupEventListeners();
    setupCursor();
});

function setupEventListeners() {
    document.getElementById('searchBtn').addEventListener('click', searchApp);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchApp();
    });
    document.getElementById('searchInput').addEventListener('input', showSuggestions);
    document.querySelector('.menu-btn')?.addEventListener('click', toggleMobileMenu);
}

function setupCursor() {
    const cursor = document.querySelector('.cursor-follower');
    if (!cursor) return;
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.display = 'block';
    });
    
    document.addEventListener('mouseleave', () => {
        cursor.style.display = 'none';
    });
}

function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
}

async function loadTrendingApps() {
    const grid = document.getElementById('appsGrid');
    const loadingSpinner = grid.querySelector('.loading-spinner');
    
    if (loadingSpinner) {
        loadingSpinner.remove();
    }
    
    grid.innerHTML = '';
    
    // Show first 100 trending apps
    const trendingToShow = TRENDING_APPS.slice(0, 100);
    
    for (const appName of trendingToShow) {
        try {
            const appData = await fetchAppData(appName);
            if (appData && appData.success) {
                const appCard = createAppCard(appData.result, appName);
                grid.appendChild(appCard);
            } else {
                const fallbackCard = createFallbackCard(appName);
                grid.appendChild(fallbackCard);
            }
        } catch (error) {
            console.error(`Error loading ${appName}:`, error);
            const fallbackCard = createFallbackCard(appName);
            grid.appendChild(fallbackCard);
        }
        
        // Small delay to prevent rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

async function fetchAppData(appName) {
    try {
        const url = `${API_BASE_URL}?apikey=${API_KEY}&appName=${encodeURIComponent(appName)}`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

function createAppCard(appData, appName) {
    const card = document.createElement('div');
    card.className = 'app-card';
    
    const iconHtml = appData.appicon 
        ? `<img src="${appData.appicon}" alt="${appData.appname}" onerror="this.src='https://via.placeholder.com/70?text=${appName.charAt(0)}'">`
        : `<i class="fas fa-mobile-alt"></i>`;
    
    card.innerHTML = `
        <div class="app-icon">
            ${iconHtml}
        </div>
        <h3 class="app-name">${escapeHtml(appData.appname || appName)}</h3>
        <div class="app-developer">
            <i class="fas fa-user"></i> ${escapeHtml(appData.developer || 'Unknown')}
        </div>
        <button class="download-btn" data-app="${escapeHtml(appName)}" data-url="${appData.download_url || ''}">
            <i class="fas fa-download"></i> Download APK
        </button>
    `;
    
    const downloadBtn = card.querySelector('.download-btn');
    downloadBtn.addEventListener('click', () => downloadApp(downloadBtn.dataset.app, downloadBtn.dataset.url));
    
    return card;
}

function createFallbackCard(appName) {
    const card = document.createElement('div');
    card.className = 'app-card';
    
    card.innerHTML = `
        <div class="app-icon">
            <i class="fas fa-mobile-alt"></i>
        </div>
        <h3 class="app-name">${escapeHtml(appName)}</h3>
        <div class="app-developer">
            <i class="fas fa-user"></i> Available
        </div>
        <button class="download-btn" data-app="${escapeHtml(appName)}" data-url="">
            <i class="fas fa-download"></i> Try Download
        </button>
    `;
    
    const downloadBtn = card.querySelector('.download-btn');
    downloadBtn.addEventListener('click', () => searchAndDownload(appName));
    
    return card;
}

async function searchApp() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    if (!searchTerm) {
        showToast('Please enter an app name', 'warning');
        return;
    }
    
    const resultsGrid = document.getElementById('searchResults');
    const resultsHeader = document.getElementById('searchResultsHeader');
    
    resultsGrid.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i><p>Searching for ' + escapeHtml(searchTerm) + '...</p></div>';
    resultsHeader.style.display = 'block';
    
    try {
        const appData = await fetchAppData(searchTerm);
        
        resultsGrid.innerHTML = '';
        
        if (appData && appData.success && appData.result) {
            const resultCount = document.getElementById('resultCount');
            resultCount.textContent = '1';
            
            const appCard = createAppCard(appData.result, searchTerm);
            resultsGrid.appendChild(appCard);
            
            // Scroll to results
            resultsHeader.scrollIntoView({ behavior: 'smooth' });
        } else {
            resultsGrid.innerHTML = `
                <div class="app-card" style="grid-column: 1/-1; text-align: center;">
                    <i class="fas fa-frown" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <h3>No results found for "${escapeHtml(searchTerm)}"</h3>
                    <p>Try checking the spelling or try a different app name</p>
                </div>
            `;
        }
    } catch (error) {
        resultsGrid.innerHTML = `
            <div class="app-card" style="grid-column: 1/-1; text-align: center;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <h3>Error searching for app</h3>
                <p>Please try again later</p>
            </div>
        `;
        console.error('Search error:', error);
    }
}

async function searchAndDownload(appName) {
    showToast(`Searching for ${appName}...`, 'info');
    
    try {
        const appData = await fetchAppData(appName);
        
        if (appData && appData.success && appData.result && appData.result.download_url) {
            window.open(appData.result.download_url, '_blank');
            showToast(`Downloading ${appName}...`, 'success');
        } else {
            showToast(`Could not find download link for ${appName}`, 'error');
        }
    } catch (error) {
        showToast('Download failed. Please try again.', 'error');
        console.error('Download error:', error);
    }
}

function downloadApp(appName, downloadUrl) {
    if (currentDownloading === appName) {
        showToast('Download already in progress', 'warning');
        return;
    }
    
    if (downloadUrl) {
        currentDownloading = appName;
        window.open(downloadUrl, '_blank');
        showToast(`Starting download for ${appName}...`, 'success');
        setTimeout(() => { currentDownloading = null; }, 5000);
    } else {
        searchAndDownload(appName);
    }
}

function showSuggestions() {
    const input = document.getElementById('searchInput').value.toLowerCase().trim();
    const suggestionsBox = document.getElementById('searchSuggestions');
    
    if (!input) {
        suggestionsBox.classList.remove('active');
        return;
    }
    
    const matches = TRENDING_APPS.filter(app => 
        app.toLowerCase().includes(input)
    ).slice(0, 5);
    
    if (matches.length > 0) {
        suggestionsBox.innerHTML = matches.map(match => 
            `<div class="suggestion-item">${escapeHtml(match)}</div>`
        ).join('');
        suggestionsBox.classList.add('active');
        
        // Add click handlers to suggestions
        document.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                document.getElementById('searchInput').value = item.textContent;
                suggestionsBox.classList.remove('active');
                searchApp();
            });
        });
    } else {
        suggestionsBox.classList.remove('active');
    }
}

function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    
    toast.innerHTML = `<i class="fas fa-${icon}"></i> <span>${escapeHtml(message)}</span>`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Close suggestions when clicking outside
document.addEventListener('click', (e) => {
    const suggestionsBox = document.getElementById('searchSuggestions');
    const searchInput = document.getElementById('searchInput');
    
    if (suggestionsBox && !suggestionsBox.contains(e.target) && e.target !== searchInput) {
        suggestionsBox.classList.remove('active');
    }
});
