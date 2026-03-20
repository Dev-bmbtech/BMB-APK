// BMB APK DOWNLOAD - Play Store Style
console.log("✅ Play Store Style Loaded");

const API_BASE_URL = 'https://api.giftedtech.co.ke/api/download/apkdl';
const API_KEY = 'gifted';

// App data with categories
const APPS_DATA = {
    recommended: [
        'Football League 2026', 'Rally Fury', 'Pocket Broker', 'Alibaba.com', 'Stunt Bike Extreme', 'Bubble Pop'
    ],
    topCharts: [
        'WhatsApp', 'Instagram', 'TikTok', 'Facebook', 'Spotify', 'Netflix', 'YouTube', 'CapCut'
    ],
    trending: [
        'Telegram', 'Discord', 'Zoom', 'Microsoft Teams', 'Signal', 'CapCut', 'Canva', 'Duolingo'
    ],
    offlineGames: [
        'Subway Surfers', 'Candy Crush', 'Temple Run', 'Plants vs Zombies', 'Hill Climb Racing', 'Angry Birds'
    ]
};

// Complete trending apps list for search suggestions
const ALL_APPS = [
    'WhatsApp', 'Instagram', 'TikTok', 'Facebook', 'Spotify', 'Netflix', 'YouTube', 'Snapchat', 
    'Telegram', 'Twitter', 'CapCut', 'Gmail', 'Google Maps', 'Uber', 'Amazon', 'Discord', 'Zoom',
    'Microsoft Teams', 'LinkedIn', 'Pinterest', 'Reddit', 'Signal', 'Viber', 'LINE', 'WeChat',
    'Football League 2026', 'Rally Fury', 'Pocket Broker', 'Alibaba.com', 'Stunt Bike Extreme', 
    'Bubble Pop', 'Subway Surfers', 'Candy Crush', 'Temple Run', 'Plants vs Zombies', 
    'Hill Climb Racing', 'Angry Birds', 'Among Us', 'Call of Duty', 'Free Fire', 'PUBG Mobile',
    'Minecraft', 'Roblox', 'Brawl Stars', 'Clash of Clans', 'Clash Royale', 'Pokémon GO'
];

// DOM Elements
const drawer = document.getElementById("drawer");
const drawerOverlay = document.getElementById("drawer-overlay");
const menuToggle = document.getElementById("menu-toggle");
const closeMenuBtn = document.getElementById("close-menu");
const searchInput = document.getElementById("searchInput");
const searchResultsSection = document.getElementById("searchResultsSection");
const searchResults = document.getElementById("searchResults");

let currentDownloading = null;

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 Play Store Style Initialized");
    initMenu();
    initTabs();
    loadAllSections();
});

// Menu Functions
function initMenu() {
    if (menuToggle) {
        menuToggle.addEventListener("click", () => {
            drawer.classList.add("open");
            drawerOverlay.classList.add("active");
        });
    }
    
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener("click", closeDrawer);
    }
    
    if (drawerOverlay) {
        drawerOverlay.addEventListener("click", closeDrawer);
    }
}

function closeDrawer() {
    drawer.classList.remove("open");
    drawerOverlay.classList.remove("active");
}

window.closeDrawer = closeDrawer;

// Tab Navigation
function initTabs() {
    const tabs = document.querySelectorAll(".tab");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    });
}

// Load all sections
async function loadAllSections() {
    await Promise.all([
        loadHorizontalSection("recommendedGrid", APPS_DATA.recommended, "horizontal"),
        loadGridSection("topChartsGrid", APPS_DATA.topCharts, "grid"),
        loadGridSection("trendingGrid", APPS_DATA.trending, "grid"),
        loadHorizontalSection("offlineGamesGrid", APPS_DATA.offlineGames, "horizontal")
    ]);
}

// Load horizontal scroll section
async function loadHorizontalSection(containerId, appNames, type) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = "";
    
    for (const appName of appNames) {
        try {
            const appData = await fetchAppData(appName);
            if (appData && appData.success) {
                const card = createHorizontalCard(appData.result, appName);
                container.appendChild(card);
            } else {
                const card = createFallbackHorizontalCard(appName);
                container.appendChild(card);
            }
        } catch (error) {
            const card = createFallbackHorizontalCard(appName);
            container.appendChild(card);
        }
        await new Promise(resolve => setTimeout(resolve, 80));
    }
}

// Load grid section
async function loadGridSection(containerId, appNames, type) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = "";
    
    for (const appName of appNames) {
        try {
            const appData = await fetchAppData(appName);
            if (appData && appData.success) {
                const card = createGridCard(appData.result, appName);
                container.appendChild(card);
            } else {
                const card = createFallbackGridCard(appName);
                container.appendChild(card);
            }
        } catch (error) {
            const card = createFallbackGridCard(appName);
            container.appendChild(card);
        }
        await new Promise(resolve => setTimeout(resolve, 80));
    }
}

// Fetch App Data
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

// Create Horizontal Card (like Play Store)
function createHorizontalCard(appData, appName) {
    const card = document.createElement("div");
    card.className = "app-card-horizontal";
    
    const rating = (Math.random() * 2 + 3).toFixed(1);
    const hasInstall = ['Rally Fury', 'Football League 2026'].includes(appName);
    
    const iconHtml = appData.appicon 
        ? `<img src="${appData.appicon}" alt="${appData.appname}">`
        : `<i class="fas fa-mobile-alt"></i>`;
    
    card.innerHTML = `
        <div class="app-icon-horizontal">
            ${iconHtml}
        </div>
        <div class="app-name-horizontal">${escapeHtml(appData.appname || appName)}</div>
        <div class="app-category">${escapeHtml(appData.developer || 'App')}</div>
        <div class="app-rating">
            <i class="fas fa-star"></i>
            <span>${rating}</span>
            <span style="color: #80868b;">★</span>
        </div>
        ${hasInstall ? '<div class="installed-badge"><i class="fas fa-check"></i> Installed</div>' : 
         `<button class="download-btn-play" data-app="${escapeHtml(appName)}" data-url="${appData.download_url || ''}">
            <i class="fas fa-download"></i> Download
        </button>`}
    `;
    
    const btn = card.querySelector(".download-btn-play");
    if (btn) {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            downloadApp(btn.dataset.app, btn.dataset.url);
        });
    }
    
    return card;
}

// Create Grid Card
function createGridCard(appData, appName) {
    const card = document.createElement("div");
    card.className = "app-card-grid";
    
    const rating = (Math.random() * 2 + 3).toFixed(1);
    const iconHtml = appData.appicon 
        ? `<img src="${appData.appicon}" alt="${appData.appname}">`
        : `<i class="fas fa-mobile-alt"></i>`;
    
    card.innerHTML = `
        <div class="app-icon-grid">
            ${iconHtml}
        </div>
        <div class="app-name-grid">${escapeHtml(appData.appname || appName)}</div>
        <div class="app-developer-grid">${escapeHtml(appData.developer || 'App')}</div>
        <div class="app-rating-grid">
            <i class="fas fa-star"></i>
            <span>${rating}</span>
            <span style="color: #80868b;">★</span>
        </div>
        <button class="download-btn-play" data-app="${escapeHtml(appName)}" data-url="${appData.download_url || ''}">
            <i class="fas fa-download"></i> Download
        </button>
    `;
    
    const btn = card.querySelector(".download-btn-play");
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        downloadApp(btn.dataset.app, btn.dataset.url);
    });
    
    return card;
}

// Fallback Horizontal Card
function createFallbackHorizontalCard(appName) {
    const card = document.createElement("div");
    card.className = "app-card-horizontal";
    const rating = (Math.random() * 2 + 3).toFixed(1);
    
    card.innerHTML = `
        <div class="app-icon-horizontal">
            <i class="fas fa-mobile-alt"></i>
        </div>
        <div class="app-name-horizontal">${escapeHtml(appName)}</div>
        <div class="app-category">App</div>
        <div class="app-rating">
            <i class="fas fa-star"></i>
            <span>${rating}</span>
            <span style="color: #80868b;">★</span>
        </div>
        <button class="download-btn-play" data-app="${escapeHtml(appName)}" data-url="">
            <i class="fas fa-download"></i> Download
        </button>
    `;
    
    const btn = card.querySelector(".download-btn-play");
    btn.addEventListener("click", () => searchAndDownload(appName));
    
    return card;
}

// Fallback Grid Card
function createFallbackGridCard(appName) {
    const card = document.createElement("div");
    card.className = "app-card-grid";
    const rating = (Math.random() * 2 + 3).toFixed(1);
    
    card.innerHTML = `
        <div class="app-icon-grid">
            <i class="fas fa-mobile-alt"></i>
        </div>
        <div class="app-name-grid">${escapeHtml(appName)}</div>
        <div class="app-developer-grid">App</div>
        <div class="app-rating-grid">
            <i class="fas fa-star"></i>
            <span>${rating}</span>
            <span style="color: #80868b;">★</span>
        </div>
        <button class="download-btn-play" data-app="${escapeHtml(appName)}" data-url="">
            <i class="fas fa-download"></i> Download
        </button>
    `;
    
    const btn = card.querySelector(".download-btn-play");
    btn.addEventListener("click", () => searchAndDownload(appName));
    
    return card;
}

// Search Function
if (searchInput) {
    searchInput.addEventListener("input", debounce(handleSearch, 500));
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleSearch();
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

async function handleSearch() {
    const searchTerm = searchInput.value.trim();
    
    if (!searchTerm) {
        searchResultsSection.style.display = "none";
        return;
    }
    
    searchResultsSection.style.display = "block";
    searchResults.innerHTML = '<div class="loading-spinner-mini"><i class="fas fa-spinner fa-spin"></i></div>';
    
    try {
        const appData = await fetchAppData(searchTerm);
        searchResults.innerHTML = "";
        
        if (appData && appData.success && appData.result) {
            const card = createGridCard(appData.result, searchTerm);
            searchResults.appendChild(card);
        } else {
            // Search in local list
            const matches = ALL_APPS.filter(app => 
                app.toLowerCase().includes(searchTerm.toLowerCase())
            ).slice(0, 6);
            
            if (matches.length > 0) {
                for (const match of matches) {
                    const data = await fetchAppData(match);
                    if (data && data.success) {
                        const card = createGridCard(data.result, match);
                        searchResults.appendChild(card);
                    } else {
                        const card = createFallbackGridCard(match);
                        searchResults.appendChild(card);
                    }
                }
            } else {
                searchResults.innerHTML = `
                    <div style="grid-column:1/-1; text-align:center; padding:40px;">
                        <i class="fas fa-search" style="font-size:48px; color:#80868b; margin-bottom:16px;"></i>
                        <h3>No results found</h3>
                        <p style="color:#5f6368;">Try searching for another app</p>
                    </div>
                `;
            }
        }
    } catch (error) {
        searchResults.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:40px;">
                <i class="fas fa-exclamation-triangle" style="font-size:48px; color:#f9ab00; margin-bottom:16px;"></i>
                <h3>Search error</h3>
                <p style="color:#5f6368;">Please try again</p>
            </div>
        `;
    }
}

async function searchAndDownload(appName) {
    showToast(`Searching for ${appName}...`, "info");
    
    try {
        const appData = await fetchAppData(appName);
        if (appData && appData.success && appData.result && appData.result.download_url) {
            window.open(appData.result.download_url, "_blank");
            showToast(`Downloading ${appName}...`, "success");
        } else {
            showToast(`Could not find download link`, "error");
        }
    } catch (error) {
        showToast("Download failed", "error");
    }
}

function downloadApp(appName, downloadUrl) {
    if (currentDownloading === appName) {
        showToast("Download in progress", "warning");
        return;
    }
    
    if (downloadUrl) {
        currentDownloading = appName;
        window.open(downloadUrl, "_blank");
        showToast(`Downloading ${appName}...`, "success");
        setTimeout(() => { currentDownloading = null; }, 5000);
    } else {
        searchAndDownload(appName);
    }
}

function showToast(message, type = "info") {
    const existing = document.querySelector(".toast");
    if (existing) existing.remove();
    
    const toast = document.createElement("div");
    toast.className = "toast";
    
    let icon = "info-circle";
    if (type === "success") icon = "check-circle";
    if (type === "error") icon = "exclamation-circle";
    if (type === "warning") icon = "exclamation-triangle";
    
    toast.innerHTML = `<i class="fas fa-${icon}"></i> ${escapeHtml(message)}`;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
}

function escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}
