// BMB APK DOWNLOAD - Main JavaScript with Supabase
import { supabase, userManager, onAuthStateChange } from './pages/supabase.js';

console.log("✅ BMB APK Download with Supabase Loaded");

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
const mainContent = document.getElementById("mainContent");
const unauthorizedMessage = document.getElementById("unauthorizedMessage");
const userAvatar = document.getElementById("userAvatar");
const accountBtn = document.getElementById("accountBtn");
const authModal = document.getElementById("authModal");
const profileModal = document.getElementById("profileModal");
const editProfileModal = document.getElementById("editProfileModal");
const getStartedBtn = document.getElementById("getStartedBtn");
const logoutBtn = document.getElementById("logoutBtn");
const editProfileBtn = document.getElementById("editProfileBtn");
const saveProfileBtn = document.getElementById("saveProfileBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const changeAvatarBtn = document.getElementById("changeAvatarBtn");
const avatarInput = document.getElementById("avatarInput");
const closeProfileBtn = document.getElementById("closeProfileBtn");
const drawerProfileBtn = document.getElementById("drawerProfileBtn");
const drawerHistoryBtn = document.getElementById("drawerHistoryBtn");

// Search History Elements
const searchHistoryDropdown = document.getElementById("searchHistoryDropdown");
const searchHistoryList = document.getElementById("searchHistoryList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

let currentAppData = null;
let autoOpenEnabled = true;
let downloadTimeout = null;
let isDownloadCancelled = false;

// Initialize
document.addEventListener("DOMContentLoaded", async () => {
    console.log("🚀 Initializing...");
    
    // Set up auth state listener
    onAuthStateChange(async (event, user) => {
        if (event === 'signed_in') {
            await onUserLoggedIn(user);
        } else if (event === 'signed_out') {
            onUserLoggedOut();
        }
    });
    
    // Check existing session
    const session = await userManager.checkSession();
    if (session) {
        await onUserLoggedIn(userManager.currentUser);
    } else {
        onUserLoggedOut();
    }
    
    initMenu();
    initTabs();
    initAuthForms();
    initProfileModals();
    initSearchHistory();
});

// User logged in handler
async function onUserLoggedIn(user) {
    console.log("User logged in:", user?.email);
    
    // Update UI
    unauthorizedMessage.style.display = "none";
    mainContent.style.display = "block";
    
    // Update avatar
    updateUserAvatar(user);
    
    // Update drawer user info
    updateDrawerUserInfo(user);
    
    // Load app data
    await loadAllSections();
}

// User logged out handler
function onUserLoggedOut() {
    console.log("User logged out");
    
    unauthorizedMessage.style.display = "flex";
    mainContent.style.display = "none";
    
    // Reset avatar
    userAvatar.innerHTML = '<i class="fas fa-user-circle"></i>';
    
    // Reset drawer
    document.getElementById("drawerUserName").textContent = "Guest User";
    document.getElementById("drawerUserEmail").textContent = "Sign in for updates";
}

// Update user avatar
function updateUserAvatar(user) {
    const avatarUrl = user?.profile?.avatar_url;
    if (avatarUrl) {
        userAvatar.innerHTML = `<img src="${avatarUrl}" alt="Avatar" style="width:32px; height:32px; border-radius:50%; object-fit:cover;">`;
    } else {
        userAvatar.innerHTML = `<i class="fas fa-user-circle"></i>`;
    }
}

// Update drawer user info
function updateDrawerUserInfo(user) {
    const fullName = user?.profile?.full_name || user?.email?.split('@')[0] || 'User';
    const email = user?.email || 'No email';
    
    document.getElementById("drawerUserName").textContent = fullName;
    document.getElementById("drawerUserEmail").textContent = email;
}

// Initialize Auth Forms
function initAuthForms() {
    // Auth tab switching
    const authTabs = document.querySelectorAll(".auth-tab");
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    
    authTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            authTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            
            const authType = tab.dataset.auth;
            if (authType === "login") {
                loginForm.classList.add("active");
                signupForm.classList.remove("active");
            } else {
                loginForm.classList.remove("active");
                signupForm.classList.add("active");
            }
        });
    });
    
    // Open auth modal
    const openAuthModal = () => {
        authModal.classList.add("active");
    };
    
    accountBtn?.addEventListener("click", openAuthModal);
    getStartedBtn?.addEventListener("click", openAuthModal);
    
    // Close modal when clicking outside
    authModal?.addEventListener("click", (e) => {
        if (e.target === authModal) {
            authModal.classList.remove("active");
        }
    });
    
    // Google sign in
    document.getElementById("googleLoginBtn")?.addEventListener("click", async () => {
        const result = await userManager.signInWithGoogle();
        if (result.success && result.url) {
            window.location.href = result.url;
        } else {
            showToast(result.error || "Google sign in failed", "error");
        }
    });
    
    document.getElementById("googleSignupBtn")?.addEventListener("click", async () => {
        const result = await userManager.signInWithGoogle();
        if (result.success && result.url) {
            window.location.href = result.url;
        } else {
            showToast(result.error || "Google sign in failed", "error");
        }
    });
    
    // Email login
    document.getElementById("loginSubmitBtn")?.addEventListener("click", async () => {
        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;
        
        if (!email || !password) {
            showToast("Please fill all fields", "error");
            return;
        }
        
        const result = await userManager.signIn(email, password);
        if (result.success) {
            authModal.classList.remove("active");
            showToast("Welcome back!", "success");
        } else {
            showToast(result.error || "Login failed", "error");
        }
    });
    
    // Email signup
    document.getElementById("signupSubmitBtn")?.addEventListener("click", async () => {
        const fullName = document.getElementById("signupName").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        const password = document.getElementById("signupPassword").value;
        const confirmPassword = document.getElementById("signupConfirmPassword").value;
        
        if (!fullName || !email || !password) {
            showToast("Please fill all fields", "error");
            return;
        }
        
        if (password !== confirmPassword) {
            showToast("Passwords do not match", "error");
            return;
        }
        
        if (password.length < 6) {
            showToast("Password must be at least 6 characters", "error");
            return;
        }
        
        const result = await userManager.signUp(email, password, fullName);
        if (result.success) {
            authModal.classList.remove("active");
            showToast("Account created! Please check your email for verification.", "success");
        } else {
            showToast(result.error || "Signup failed", "error");
        }
    });
    
    // Switch between forms
    document.querySelectorAll(".auth-switch").forEach(switchBtn => {
        switchBtn.addEventListener("click", () => {
            const currentActive = document.querySelector(".auth-tab.active");
            const target = currentActive.dataset.auth === "login" ? "signup" : "login";
            document.querySelector(`.auth-tab[data-auth="${target}"]`).click();
        });
    });
}

// Initialize Profile Modals
function initProfileModals() {
    // Open profile modal
    userAvatar?.addEventListener("click", () => {
        if (userManager.currentUser) {
            updateProfileModal();
            profileModal.classList.add("active");
        } else {
            authModal.classList.add("active");
        }
    });
    
    drawerProfileBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        closeDrawer();
        if (userManager.currentUser) {
            updateProfileModal();
            profileModal.classList.add("active");
        } else {
            authModal.classList.add("active");
        }
    });
    
    // Close profile modal
    closeProfileBtn?.addEventListener("click", () => {
        profileModal.classList.remove("active");
    });
    
    profileModal?.addEventListener("click", (e) => {
        if (e.target === profileModal) {
            profileModal.classList.remove("active");
        }
    });
    
    // Edit profile
    editProfileBtn?.addEventListener("click", () => {
        profileModal.classList.remove("active");
        openEditProfileModal();
    });
    
    // Logout
    logoutBtn?.addEventListener("click", async () => {
        const result = await userManager.signOut();
        if (result.success) {
            profileModal.classList.remove("active");
            showToast("Logged out successfully", "success");
        } else {
            showToast(result.error || "Logout failed", "error");
        }
    });
    
    // Close edit modal
    cancelEditBtn?.addEventListener("click", () => {
        editProfileModal.classList.remove("active");
    });
    
    editProfileModal?.addEventListener("click", (e) => {
        if (e.target === editProfileModal) {
            editProfileModal.classList.remove("active");
        }
    });
    
    // Change avatar
    changeAvatarBtn?.addEventListener("click", () => {
        avatarInput?.click();
    });
    
    avatarInput?.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (file) {
            const result = await userManager.uploadAvatar(file);
            if (result.success) {
                updateUserAvatar(userManager.currentUser);
                updateProfileModal();
                showToast("Avatar updated!", "success");
            } else {
                showToast(result.error || "Upload failed", "error");
            }
        }
    });
    
    // Save profile
    saveProfileBtn?.addEventListener("click", async () => {
        const fullName = document.getElementById("editName").value.trim();
        
        if (!fullName) {
            showToast("Please enter your name", "error");
            return;
        }
        
        const result = await userManager.updateProfile({ full_name: fullName });
        if (result.success) {
            editProfileModal.classList.remove("active");
            updateProfileModal();
            updateDrawerUserInfo(userManager.currentUser);
            showToast("Profile updated!", "success");
        } else {
            showToast(result.error || "Update failed", "error");
        }
    });
}

function updateProfileModal() {
    const user = userManager.currentUser;
    if (!user) return;
    
    const fullName = user.profile?.full_name || user.email?.split('@')[0] || 'User';
    const avatarUrl = user.profile?.avatar_url;
    
    document.getElementById("profileName").textContent = fullName;
    document.getElementById("profileEmail").textContent = user.email;
    
    const profileAvatar = document.getElementById("profileAvatar");
    if (avatarUrl) {
        profileAvatar.innerHTML = `<img src="${avatarUrl}" alt="Avatar" style="width:100px; height:100px; border-radius:50%; object-fit:cover;">`;
    } else {
        profileAvatar.innerHTML = `<i class="fas fa-user-circle"></i>`;
    }
}

function openEditProfileModal() {
    const user = userManager.currentUser;
    if (!user) return;
    
    const fullName = user.profile?.full_name || user.email?.split('@')[0] || 'User';
    const avatarUrl = user.profile?.avatar_url;
    
    document.getElementById("editName").value = fullName;
    const editAvatarImg = document.getElementById("editAvatarImg");
    if (avatarUrl) {
        editAvatarImg.src = avatarUrl;
        editAvatarImg.style.display = "block";
        document.querySelector("#editAvatar i")?.remove();
    } else {
        editAvatarImg.style.display = "none";
    }
    
    editProfileModal.classList.add("active");
}

// Initialize Search History
async function initSearchHistory() {
    // Show history on focus
    searchInput?.addEventListener("focus", async () => {
        if (userManager.currentUser) {
            await loadSearchHistory();
            searchHistoryDropdown.classList.add("active");
        }
    });
    
    // Hide on click outside
    document.addEventListener("click", (e) => {
        if (!searchHistoryDropdown?.contains(e.target) && e.target !== searchInput) {
            searchHistoryDropdown.classList.remove("active");
        }
    });
    
    // Clear all history
    clearHistoryBtn?.addEventListener("click", async () => {
        const result = await userManager.clearSearchHistory();
        if (result.success) {
            await loadSearchHistory();
            showToast("Search history cleared", "success");
        }
    });
}

async function loadSearchHistory() {
    if (!userManager.currentUser) return;
    
    const result = await userManager.getSearchHistory(10);
    const history = result.history || [];
    
    if (history.length === 0) {
        searchHistoryList.innerHTML = '<div class="history-item" style="color: var(--text-muted);">No recent searches</div>';
        return;
    }
    
    searchHistoryList.innerHTML = history.map(item => `
        <div class="history-item" data-term="${escapeHtml(item.search_term)}" data-id="${item.id}">
            <i class="fas fa-history"></i>
            <span>${escapeHtml(item.search_term)}</span>
            <i class="fas fa-times delete-history" data-id="${item.id}"></i>
        </div>
    `).join('');
    
    // Add click handlers
    document.querySelectorAll(".history-item").forEach(el => {
        el.addEventListener("click", async (e) => {
            if (e.target.classList.contains("delete-history")) {
                e.stopPropagation();
                const id = e.target.dataset.id;
                await userManager.deleteSearchHistoryItem(id);
                await loadSearchHistory();
            } else {
                const term = el.dataset.term;
                if (term) {
                    searchInput.value = term;
                    searchHistoryDropdown.classList.remove("active");
                    await handleSearch();
                }
            }
        });
    });
}

// Search function
async function handleSearch() {
    const searchTerm = searchInput.value.trim();
    
    if (!searchTerm) {
        searchResultsSection.style.display = "none";
        return;
    }
    
    // Save to search history if logged in
    if (userManager.currentUser) {
        await userManager.saveSearchHistory(searchTerm);
        await loadSearchHistory();
    }
    
    searchResultsSection.style.display = "block";
    searchResults.innerHTML = '<div class="loading-spinner-mini"><i class="fas fa-spinner fa-spin"></i><p style="margin-top:12px;">Searching...</p></div>';
    
    searchResultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    
    try {
        const appData = await fetchAppData(searchTerm);
        searchResults.innerHTML = "";
        
        if (appData && appData.success && appData.result) {
            const card = createGridCard(appData.result, searchTerm);
            searchResults.appendChild(card);
        } else {
            const matches = ALL_APPS.filter(app => 
                app.toLowerCase().includes(searchTerm.toLowerCase())
            ).slice(0, 8);
            
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
                    <div style="grid-column:1/-1; text-align:center; padding:60px 20px;">
                        <i class="fas fa-search" style="font-size:56px; color:#8a8a9a; margin-bottom:20px;"></i>
                        <h3 style="margin-bottom:8px;">No results found</h3>
                        <p style="color:#b0b0c0;">Try searching for another app name</p>
                    </div>
                `;
            }
        }
    } catch (error) {
        searchResults.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:60px 20px;">
                <i class="fas fa-exclamation-triangle" style="font-size:56px; color:#f9ab00; margin-bottom:20px;"></i>
                <h3>Search error</h3>
                <p style="color:#b0b0c0;">Please try again</p>
            </div>
        `;
    }
}

// Debounce for search
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

// Setup search input
if (searchInput) {
    searchInput.addEventListener("input", debounce(handleSearch, 500));
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleSearch();
    });
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
            if (searchInput) searchInput.value = "";
            searchResultsSection.style.display = "none";
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
        if (!btn.dataset.url) {
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
        if (!btn.dataset.url) {
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

// Download Modal Functions
function createModal() {
    // ... (same as before, but ensure it's only created once)
    if (document.getElementById("downloadModal")) return;
    
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
                        <span id="downloadStatusText">Waiting to start</span>
                    </div>
                    <div class="status-verified">
                        <i class="fas fa-shield-alt"></i>
                        <span>Verified by Play Protect</span>
                    </div>
                </div>
                <div class="progress-bar-container" id="progressContainer" style="display: none;">
                    <div class="progress-bar" id="progressBar"></div>
                    <div class="progress-percent" id="progressPercent">0%</div>
                </div>
                <div class="modal-actions" id="modalActions">
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
    
    document.getElementById("modalCancelBtn").addEventListener("click", cancelDownload);
    document.getElementById("autoOpenCheckbox").addEventListener("change", (e) => {
        autoOpenEnabled = e.target.checked;
    });
}

function showModal(appData, appName) {
    createModal();
    
    const modal = document.getElementById("downloadModal");
    if (!modal) return;
    
    // Reset states
    if (downloadTimeout) {
        clearTimeout(downloadTimeout);
        downloadTimeout = null;
    }
    isDownloadCancelled = false;
    
    currentAppData = appData;
    
    // Reset modal content
    const statusText = document.getElementById("downloadStatusText");
    const progressContainer = document.getElementById("progressContainer");
    const modalActions = document.getElementById("modalActions");
    const progressBar = document.getElementById("progressBar");
    const progressPercent = document.getElementById("progressPercent");
    
    modalActions.innerHTML = `<button class="btn-cancel" id="modalCancelBtn">Cancel</button>`;
    document.getElementById("modalCancelBtn").addEventListener("click", cancelDownload);
    
    progressContainer.style.display = "none";
    if (progressBar) progressBar.style.width = "0%";
    if (progressPercent) progressPercent.textContent = "0%";
    
    document.getElementById("modalAppName").textContent = appData.appname || appName;
    document.getElementById("modalDeveloper").querySelector("span").textContent = appData.developer || "Unknown Developer";
    
    const size = Math.floor(Math.random() * 120 + 30);
    document.getElementById("modalAppSize").textContent = `Size: ${size} MB`;
    
    const modalIcon = document.getElementById("modalIcon");
    if (appData.appicon) {
        modalIcon.innerHTML = `<img src="${appData.appicon}" alt="${appData.appname}">`;
    } else {
        modalIcon.innerHTML = `<i class="fas fa-mobile-alt"></i>`;
    }
    
    statusText.textContent = "Waiting to start";
    statusText.style.color = "var(--rating-color)";
    
    modal.classList.add("active");
    startDownloadSequence(size);
}

function startDownloadSequence(fileSizeMB) {
    let progress = 0;
    const totalSteps = 100;
    let currentStep = 0;
    
    const progressContainer = document.getElementById("progressContainer");
    const progressBar = document.getElementById("progressBar");
    const progressPercent = document.getElementById("progressPercent");
    const statusText = document.getElementById("downloadStatusText");
    
    progressContainer.style.display = "block";
    statusText.textContent = "Initializing...";
    
    setTimeout(() => {
        if (isDownloadCancelled) return;
        statusText.textContent = "Connecting...";
    }, 500);
    
    const interval = setInterval(() => {
        if (isDownloadCancelled) {
            clearInterval(interval);
            return;
        }
        
        if (currentStep < totalSteps) {
            let increment = Math.random() * 8 + 2;
            currentStep = Math.min(currentStep + increment, totalSteps);
            progress = currentStep;
            
            progressBar.style.width = `${progress}%`;
            progressPercent.textContent = `${Math.floor(progress)}%`;
            
            if (progress < 20) {
                statusText.textContent = "Downloading...";
            } else if (progress < 50) {
                statusText.textContent = `Downloaded ${Math.floor(progress)}%`;
            } else if (progress < 90) {
                statusText.textContent = `Almost there... ${Math.floor(progress)}%`;
            } else if (progress >= 95) {
                statusText.textContent = "Finalizing...";
            }
        } else {
            clearInterval(interval);
            
            if (!isDownloadCancelled) {
                statusText.textContent = "Ready to install";
                statusText.style.color = "var(--success-color)";
                
                const modalActions = document.getElementById("modalActions");
                modalActions.innerHTML = `
                    <button class="btn-open" id="modalOpenBtn">Open</button>
                    <button class="btn-cancel" id="modalCancelBtn">Cancel</button>
                `;
                
                document.getElementById("modalOpenBtn").addEventListener("click", () => {
                    if (currentAppData && currentAppData.download_url) {
                        window.open(currentAppData.download_url, "_blank");
                        showToast("Download started!", "success");
                        closeModal();
                    }
                });
                
                document.getElementById("modalCancelBtn").addEventListener("click", cancelDownload);
                
                if (autoOpenEnabled && currentAppData && currentAppData.download_url) {
                    downloadTimeout = setTimeout(() => {
                        if (!isDownloadCancelled && currentAppData && currentAppData.download_url) {
                            window.open(currentAppData.download_url, "_blank");
                            showToast("Download started automatically!", "success");
                            closeModal();
                        }
                    }, 1000);
                }
            }
        }
    }, 80);
}

function cancelDownload() {
    if (downloadTimeout) {
        clearTimeout(downloadTimeout);
        downloadTimeout = null;
    }
    isDownloadCancelled = true;
    
    const modal = document.getElementById("downloadModal");
    const statusText = document.getElementById("downloadStatusText");
    const modalActions = document.getElementById("modalActions");
    
    if (statusText) {
        statusText.textContent = "Cancelled";
        statusText.style.color = "var(--danger-color)";
    }
    
    modalActions.innerHTML = `
        <button class="btn-cancel" id="modalCloseBtn" style="background: var(--primary-color); color: white;">Close</button>
    `;
    document.getElementById("modalCloseBtn").addEventListener("click", closeModal);
    
    setTimeout(() => {
        if (modal && modal.classList.contains("active")) {
            closeModal();
        }
    }, 2000);
    
    showToast("Download cancelled", "warning");
}

function closeModal() {
    const modal = document.getElementById("downloadModal");
    if (modal) {
        modal.classList.remove("active");
        if (downloadTimeout) {
            clearTimeout(downloadTimeout);
            downloadTimeout = null;
        }
        currentAppData = null;
        isDownloadCancelled = false;
    }
}

async function searchAndDownload(appName) {
    showToast(`Finding ${appName}...`, "info");
    
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
            showToast(`Could not find download link for ${appName}`, "error");
            closeModal();
        }
    } catch (error) {
        showToast("Download failed. Please try again.", "error");
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
