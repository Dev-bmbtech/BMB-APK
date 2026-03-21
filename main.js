// BMB APK DOWNLOAD - Play Store Style with Download Modal
console.log("✅ Play Store Style with Modal Loaded");

const API_BASE_URL = 'https://api.giftedtech.co.ke/api/download/apkdl';
const API_KEY = 'gifted';

// App data with categories
const APPS_DATA = {
    recommended: [
        'Vidu - AI Video Generator', 'Hailuo AI: Image&Video Maker', 'Genspark AI Workspace', 
        'AzamPesa', 'Canva', 'CapCut'
    ],
    topCharts: [
        'WhatsApp', 'Instagram', 'TikTok', 'Facebook', 'Spotify', 'Netflix', 'YouTube', 'CapCut'
    ],
    trending: [
        'Telegram', 'Discord', 'Zoom', 'Microsoft Teams', 'Signal', 'Canva', 'Duolingo', 'AzamPesa'
    ],
    offlineGames: [
        'Subway Surfers', 'Candy Crush', 'Temple Run', 'Plants vs Zombies', 'Hill Climb Racing', 'Angry Birds'
    ]
};

// Complete trending apps list
const ALL_APPS = [
    'WhatsApp', 'Instagram', 'TikTok', 'Facebook', 'Spotify', 'Netflix', 'YouTube', 'Snapchat', 
    'Telegram', 'Twitter', 'CapCut', 'Gmail', 'Google Maps', 'Uber', 'Amazon', 'Discord', 'Zoom',
    'Microsoft Teams', 'LinkedIn', 'Pinterest', 'Reddit', 'Signal', 'Viber', 'LINE', 'WeChat',
    'Vidu - AI Video Generator', 'Hailuo AI: Image&Video Maker', 'Genspark AI Workspace', 
    'AzamPesa', 'Canva', 'Subway Surfers', 'Candy Crush', 'Temple Run', 'Plants vs Zombies', 
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

let currentAppData = null;
let autoOpenEnabled = true;

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 Play Store Style Initialized");
    initMenu();
    initTabs();
    loadAllSections();
    createModal();
});

// Create Download Modal
function createModal() {
    const modalHTML = `
        <div id="downloadModal" class="modal-overlay">
            <div class="download-modal">
                <div class="modal-header">
                    <div class="modal-icon" id="modalIcon">
                        <i class="fas fa-mobile-alt"></i>
                    </div>
                    <div class="modal-title">
                        <h3 id="modalAppName">App Name</h3>
                        <p id="modalAppSize">Size: -- MB</p>
                    </div>
                </div>
                <div class="modal-developer" id="modalDeveloper">
                    <i class="fas fa-user"></i> <span>Developer</span>
                </div>
                <div class="modal-status">
                    <div class="status-pending">
                        <span>Pending...</span>
                        <span>Downloading</span>
                    </div>
                    <div class="status-verified">
                        <i class="fas fa-shield-alt"></i>
                        <span>Verified by Play Protect</span>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn-open" id="modalOpenBtn">Open</button>
                    <button class="btn-cancel" id="modalCancelBtn">Cancel</button>
                </div>
                <div class="modal-checkbox">
                    <input type="checkbox" id="autoOpenCheckbox" checked>
                    <label for="autoOpenCheckbox">Auto-open when ready</label>
                </div>
                <div class="modal-sponsor">
                    <i class="fas fa-ad"></i> Sponsored · Suggested for you
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add event listeners
    document.getElementById("modalOpenBtn").addEventListener("click", () => {
        if (currentAppData && currentAppData.downloadUrl) {
            window.open(currentAppData.downloadUrl, "_blank");
            closeModal();
        }
    });
    
    document.getElementById("modalCancelBtn").addEventListener("click", closeModal);
    document.getElementById("autoOpenCheckbox").addEventListener("change", (e) => {
        autoOpenEnabled = e.target.checked;
    });
}

function showModal(appData, appName) {
    const modal = document.getElementById("downloadModal");
    if (!modal) return;
    
    currentAppData = appData;
    
    // Set modal content
    document.getElementById("modalAppName").textContent = appData.appname || appName;
    document.getElementById("modalDeveloper").querySelector("span").textContent = appData.developer || "Unknown Developer";
    
    // Set random size between 30-150 MB
    const size = Math.floor(Math.random() * 120 + 30);
    document.getElementById("modalAppSize").textContent = `Size: ${size} MB`;
    
    // Set icon
    const modalIcon = document.getElementById("modalIcon");
    if (appData.appicon) {
        modalIcon.innerHTML = `<img src="${appData.appicon}" alt="${appData.appname}">`;
    } else {
        modalIcon.innerHTML = `<i class="fas fa-mobile-alt"></i>`;
    }
    
    // Update status animation
    const statusPending = modal.querySelector(".status-pending span:last-child");
    statusPending.textContent = "Pending...";
    statusPending.style.color = "var(--rating-color)";
    
    modal.classList.add("active");
    
    // Simulate download start
    setTimeout(() => {
        if (document.getElementById("downloadModal").classList.contains("active")) {
            statusPending.textContent = "Downloading...";
        }
    }, 500);
    
    // Simulate download complete after 2 seconds
    setTimeout(() => {
        if (document.getElementById("downloadModal").classList.contains("active")) {
            statusPending.textContent = "Ready to install";
            statusPending.style.color = "var(--success-color)";
            
            if (autoOpenEnabled) {
                window.open(appData.download_url, "_blank");
                setTimeout(closeModal, 1000);
            }
        }
    }, 2000);
}

function closeModal() {
    const modal = document.getElementById("downloadModal");
    if (modal) {
        modal.classList.remove("active");
        currentAppData = null;
    }
}

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

// Create Horizontal Card
function createHorizontalCard(appData, appName) {
    const card = document.createElement("div");
    card.className = "app-card-horizontal";
    
    const rating = (Math.random() * 2 + 3).toFixed(1);
    const category = getCategory(appName);
    const size = Math.floor(Math.random() * 120 + 30);
    
    const iconHtml = appData.appicon 
        ? `<img src="${appData.appicon}" alt="${appData.appname}">`
        : `<i class="fas fa-mobile-alt"></i>`;
    
    card.innerHTML = `
        <div class="app-icon-horizontal">
            ${iconHtml}
        </div>
        <div class="app-name-horizontal">${escapeHtml(appData.appname || appName)}</div>
        <div class="app-category">${category}</div>
        <div class="app-rating">
            <i class="fas fa-star"></i>
            <span>${rating}</span>
            <span style="color: #80868b;">★ ${size} MB</span>
        </div>
        <button class="download-btn-play" data-app="${escapeHtml(appName)}" data-url="${appData.download_url || ''}" data-icon="${appData.appicon || ''}" data-developer="${escapeHtml(appData.developer || category)}">
            <i class="fas fa-download"></i> Download
        </button>
    `;
    
    const btn = card.querySelector(".download-btn-play");
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const appInfo = {
            appname: appName,
            download_url: btn.dataset.url,
            appicon: btn.dataset.icon,
            developer: btn.dataset.developer
        };
        showModal(appInfo, appName);
        if (btn.dataset.url) {
            // Download will happen after modal
        } else {
            searchAndDownload(appName);
        }
    });
    
    return card;
}

// Create Grid Card
function createGridCard(appData, appName) {
    const card = document.createElement("div");
    card.className = "app-card-grid";
    
    const rating = (Math.random() * 2 + 3).toFixed(1);
    const category = getCategory(appName);
    const size = Math.floor(Math.random() * 120 + 30);
    
    const iconHtml = appData.appicon 
        ? `<img src="${appData.appicon}" alt="${appData.appname}">`
        : `<i class="fas fa-mobile-alt"></i>`;
    
    card.innerHTML = `
        <div class="app-icon-grid">
            ${iconHtml}
        </div>
        <div class="app-name-grid">${escapeHtml(appData.appname || appName)}</div>
        <div class="app-developer-grid">${category}</div>
        <div class="app-rating-grid">
            <i class="fas fa-star"></i>
            <span>${rating}</span>
            <span style="color: #80868b;">★ ${size} MB</span>
        </div>
        <button class="download-btn-play" data-app="${escapeHtml(appName)}" data-url="${appData.download_url || ''}" data-icon="${appData.appicon || ''}" data-developer="${escapeHtml(appData.developer || category)}">
            <i class="fas fa-download"></i> Download
        </button>
    `;
    
    const btn = card.querySelector(".download-btn-play");
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const appInfo = {
            appname: appName,
            download_url: btn.dataset.url,
            appicon: btn.dataset.icon,
            developer: btn.dataset.developer
        };
        showModal(appInfo, appName);
        if (btn.dataset.url) {
            // Download will happen after modal
        } else {
            searchAndDownload(appName);
        }
    });
    
    return card;
}

// Fallback cards
function createFallbackHorizontalCard(appName) {
    const card = document.createElement("div");
    card.className = "app-card-horizontal";
    const rating = (Math.random() * 2 + 3).toFixed(1);
    const category = getCategory(appName);
    const size = Math.floor(Math.random() * 120 + 30);
    
    card.innerHTML = `
        <div class="app-icon-horizontal">
            <i class="fas fa-mobile-alt"></i>
        </div>
        <div class="app-name-horizontal">${escapeHtml(appName)}</div>
        <div class="app-category">${category}</div>
        <div class="app-rating">
            <i class="fas fa-star"></i>
            <span>${rating}</span>
            <span style="color: #80868b;">★ ${size} MB</span>
        </div>
        <button class="download-btn-play" data-app="${escapeHtml(appName)}" data-url="">
            <i class="fas fa-download"></i> Download
        </button>
    `;
    
    const btn = card.querySelector(".download-btn-play");
    btn.addEventListener("click", () => {
        const appInfo = {
            appname: appName,
            download_url: "",
            appicon: "",
            developer: category
        };
        showModal(appInfo, appName);
        searchAndDownload(appName);
    });
    
    return card;
}

function createFallbackGridCard(appName) {
    const card = document.createElement("div");
    card.className = "app-card-grid";
    const rating = (Math.random() * 2 + 3).toFixed(1);
    const category = getCategory(appName);
    const size = Math.floor(Math.random() * 120 + 30);
    
    card.innerHTML = `
        <div class="app-icon-grid">
            <i class="fas fa-mobile-alt"></i>
        </div>
        <div class="app-name-grid">${escapeHtml(appName)}</div>
        <div class="app-developer-grid">${category}</div>
        <div class="app-rating-grid">
            <i class="fas fa-star"></i>
            <span>${rating}</span>
            <span style="color: #80868b;">★ ${size} MB</span>
        </div>
        <button class="download-btn-play" data-app="${escapeHtml(appName)}" data-url="">
            <i class="fas fa-download"></i> Download
        </button>
    `;
    
    const btn = card.querySelector(".download-btn-play");
    btn.addEventListener("click", () => {
        const appInfo = {
            appname: appName,
            download_url: "",
            appicon: "",
            developer: category
        };
        showModal(appInfo, appName);
        searchAndDownload(appName);
    });
    
    return card;
}

function getCategory(appName) {
    const lower = appName.toLowerCase();
    if (lower.includes('game') || lower.includes('subway') || lower.includes('candy') || lower.includes('temple') || lower.includes('angry')) 
        return 'Game';
    if (lower.includes('ai') || lower.includes('vidu') || lower.includes('hailuo') || lower.includes('genspark')) 
        return 'AI & Tools';
    if (lower.includes('pesa') || lower.includes('finance')) 
        return 'Finance';
    if (lower.includes('whatsapp') || lower.includes('instagram') || lower.includes('facebook') || lower.includes('telegram')) 
        return 'Social';
    if (lower.includes('canva') || lower.includes('capcut')) 
        return 'Art & Design';
    return 'App';
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
                        <i class="fas fa-search" style="font-size:48px; color:#8a8a9a; margin-bottom:16px;"></i>
                        <h3>No results found</h3>
                        <p style="color:#b0b0c0;">Try searching for another app</p>
                    </div>
                `;
            }
        }
    } catch (error) {
        searchResults.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:40px;">
                <i class="fas fa-exclamation-triangle" style="font-size:48px; color:#f9ab00; margin-bottom:16px;"></i>
                <h3>Search error</h3>
                <p style="color:#b0b0c0;">Please try again</p>
            </div>
        `;
    }
}

async function searchAndDownload(appName) {
    showToast(`Searching for ${appName}...`, "info");
    
    try {
        const appData = await fetchAppData(appName);
        if (appData && appData.success && appData.result && appData.result.download_url) {
            const appInfo = {
                appname: appName,
                download_url: appData.result.download_url,
                appicon: appData.result.appicon,
                developer: appData.result.developer
            };
            showModal(appInfo, appName);
        } else {
            showToast(`Could not find download link`, "error");
            closeModal();
        }
    } catch (error) {
        showToast("Download failed", "error");
        closeModal();
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
