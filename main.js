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
            const appData = await fetchAppData
