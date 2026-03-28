// BMB APK DOWNLOAD - Main JavaScript (Premium Version)
console.log("🚀 BmbApk Premium Loaded");

const API_BASE_URL = 'https://api.giftedtech.co.ke/api/download/apkdl';
const API_KEY = 'gifted';

// App Data
const APPS_DATA = {
    recommended: [
        'WhatsApp', 'Instagram', 'TikTok', 'Facebook', 'Spotify', 'Netflix', 'YouTube', 'CapCut'
    ],
    topCharts: [
        'Telegram', 'Discord', 'Zoom', 'Microsoft Teams', 'Signal', 'Canva', 'Duolingo', 'Spotify'
    ],
    trending: [
        'CapCut', 'Canva', 'Genspark AI Workspace', 'AzamPesa', 'Vidu - AI Video Generator', 
        'Hailuo AI: Image&Video Maker', 'Subway Surfers', 'Candy Crush'
    ],
    offlineGames: [
        'Subway Surfers', 'Candy Crush', 'Temple Run', 'Plants vs Zombies', 'Hill Climb Racing', 'Angry Birds'
    ]
};

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
let currentUser = null;
let downloadInterval = null;
let currentDownload = null;

// Initialize
document.addEventListener("DOMContentLoaded", async () => {
    // Initialize AOS
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });
    
    // Hide loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) loadingScreen.classList.add('hide');
    }, 1000);
    
    // Check saved user
    const savedUser = localStorage.getItem('bmb_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showMainContent();
        loadAllSections();
    } else {
        showUnauthorized();
    }
    
    // Initialize all
    initMenu();
    initTabs();
    initAuthModals();
    initProfileModals();
    initSearchHistory();
    initTheme();
    initCursor();
    initEventListeners();
});

// Show/Hide Content
function showMainContent() {
    const unauthorized = document.getElementById('unauthorizedMessage');
    const mainContent = document.getElementById('mainContent');
    if (unauthorized) unauthorized.style.display = 'none';
    if (mainContent) mainContent.style.display = 'block';
    updateUserUI();
}

function showUnauthorized() {
    const unauthorized = document.getElementById('unauthorizedMessage');
    const mainContent = document.getElementById('mainContent');
    if (unauthorized) unauthorized.style.display = 'flex';
    if (mainContent) mainContent.style.display = 'none';
}

// Update User UI
function updateUserUI() {
    if (!currentUser) return;
    
    // Update avatar
    const userAvatar = document.getElementById('userAvatar');
    if (userAvatar) {
        if (currentUser.avatar) {
            userAvatar.innerHTML = `<img src="${currentUser.avatar}" alt="Avatar">`;
        } else {
            userAvatar.innerHTML = `<i class="fas fa-user-circle"></i>`;
        }
    }
    
    // Update dropdown
    const dropdownUserName = document.getElementById('dropdownUserName');
    const dropdownUserEmail = document.getElementById('dropdownUserEmail');
    if (dropdownUserName) dropdownUserName.textContent = currentUser.name || currentUser.email.split('@')[0];
    if (dropdownUserEmail) dropdownUserEmail.textContent = currentUser.email;
    
    // Update drawer
    const drawerUserName = document.getElementById('drawerUserName');
    const drawerUserEmail = document.getElementById('drawerUserEmail');
    if (drawerUserName) drawerUserName.textContent = currentUser.name || currentUser.email.split('@')[0];
    if (drawerUserEmail) drawerUserEmail.textContent = currentUser.email;
    
    // Update profile modal
    const profileNameValue = document.getElementById('profileNameValue');
    const profileEmailValue = document.getElementById('profileEmailValue');
    const profileDateValue = document.getElementById('profileDateValue');
    if (profileNameValue) profileNameValue.textContent = currentUser.name || currentUser.email.split('@')[0];
    if (profileEmailValue) profileEmailValue.textContent = currentUser.email;
    if (profileDateValue) profileDateValue.textContent = currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Today';
    
    const profileAvatarLarge = document.getElementById('profileAvatarLarge');
    if (profileAvatarLarge) {
        if (currentUser.avatar) {
            profileAvatarLarge.innerHTML = `<img src="${currentUser.avatar}" alt="Avatar">`;
        } else {
            profileAvatarLarge.innerHTML = `<i class="fas fa-user-circle"></i>`;
        }
    }
}

// Initialize Menu
function initMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const drawer = document.getElementById('drawer');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const closeDrawer = document.getElementById('closeDrawer');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            drawer.classList.add('open');
            drawerOverlay.classList.add('active');
        });
    }
    
    if (closeDrawer) {
        closeDrawer.addEventListener('click', () => {
            drawer.classList.remove('open');
            drawerOverlay.classList.remove('active');
        });
    }
    
    if (drawerOverlay) {
        drawerOverlay.addEventListener('click', () => {
            drawer.classList.remove('open');
            drawerOverlay.classList.remove('active');
        });
    }
    
    // Drawer links
    const drawerProfileLink = document.getElementById('drawerProfileLink');
    const drawerHistoryLink = document.getElementById('drawerHistoryLink');
    
    if (drawerProfileLink) {
        drawerProfileLink.addEventListener('click', (e) => {
            e.preventDefault();
            drawer.classList.remove('open');
            drawerOverlay.classList.remove('active');
            if (currentUser) openProfileModal();
            else openAuthModal();
        });
    }
    
    if (drawerHistoryLink) {
        drawerHistoryLink.addEventListener('click', (e) => {
            e.preventDefault();
            drawer.classList.remove('open');
            drawerOverlay.classList.remove('active');
            if (currentUser) loadSearchHistory();
            else openAuthModal();
        });
    }
}

// Initialize Tabs
function initTabs() {
    const tabs = document.querySelectorAll('.tab-item');
    const indicator = document.querySelector('.tab-indicator');
    
    if (!tabs.length) return;
    
    function updateIndicator(activeTab) {
        if (!indicator) return;
        const rect = activeTab.getBoundingClientRect();
        const container = activeTab.parentElement.getBoundingClientRect();
        indicator.style.width = `${rect.width}px`;
        indicator.style.left = `${rect.left - container.left}px`;
    }
    
    const activeTab = document.querySelector('.tab-item.active');
    if (activeTab) updateIndicator(activeTab);
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            updateIndicator(tab);
            
            // Clear search
            const searchInput = document.getElementById('searchInput');
            if (searchInput) searchInput.value = '';
            
            const searchResults = document.getElementById('searchResultsSection');
            if (searchResults) searchResults.style.display = 'none';
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// Initialize Auth Modals
function initAuthModals() {
    const authModal = document.getElementById('authModal');
    const getStartedBtn = document.getElementById('getStartedBtn');
    const closeAuthModal = document.getElementById('closeAuthModal');
    const authTabs = document.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const authSwitches = document.querySelectorAll('.auth-switch');
    const togglePasswords = document.querySelectorAll('.toggle-password');
    
    // Open modal
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => openAuthModal());
    }
    
    // Close modal
    if (closeAuthModal) {
        closeAuthModal.addEventListener('click', () => closeAuthModal());
    }
    
    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) closeAuthModal();
        });
    }
    
    // Tab switching
    if (authTabs.length) {
        authTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                authTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const authType = tab.dataset.auth;
                if (authType === 'login') {
                    loginForm.classList.add('active');
                    signupForm.classList.remove('active');
                } else {
                    loginForm.classList.remove('active');
                    signupForm.classList.add('active');
                }
            });
        });
    }
    
    // Switch between forms
    authSwitches.forEach(switchBtn => {
        switchBtn.addEventListener('click', () => {
            const currentActive = document.querySelector('.auth-tab.active');
            const target = currentActive?.dataset.auth === 'login' ? 'signup' : 'login';
            const targetTab = document.querySelector(`.auth-tab[data-auth="${target}"]`);
            if (targetTab) targetTab.click();
        });
    });
    
    // Toggle password visibility
    togglePasswords.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;
            const input = document.getElementById(targetId);
            if (input) {
                const type = input.type === 'password' ? 'text' : 'password';
                input.type = type;
                btn.innerHTML = `<i class="fas fa-${type === 'password' ? 'eye' : 'eye-slash'}"></i>`;
            }
        });
    });
    
    // Login
    const loginSubmit = document.getElementById('loginSubmitBtn');
    if (loginSubmit) {
        loginSubmit.addEventListener('click', () => {
            const email = document.getElementById('loginEmail')?.value.trim();
            const password = document.getElementById('loginPassword')?.value;
            const rememberMe = document.getElementById('rememberMe')?.checked;
            
            if (!email || !password) {
                showToast('Please fill all fields', 'error');
                return;
            }
            
            // Demo login - accept any email/password
            currentUser = {
                email: email,
                name: email.split('@')[0],
                avatar: null,
                createdAt: new Date().toISOString()
            };
            
            if (rememberMe) {
                localStorage.setItem('bmb_user', JSON.stringify(currentUser));
            } else {
                sessionStorage.setItem('bmb_user', JSON.stringify(currentUser));
            }
            
            closeAuthModal();
            showMainContent();
            loadAllSections();
            showToast(`Welcome back, ${currentUser.name}!`, 'success');
        });
    }
    
    // Signup
    const signupSubmit = document.getElementById('signupSubmitBtn');
    if (signupSubmit) {
        signupSubmit.addEventListener('click', () => {
            const name = document.getElementById('signupName')?.value.trim();
            const email = document.getElementById('signupEmail')?.value.trim();
            const password = document.getElementById('signupPassword')?.value;
            const confirmPassword = document.getElementById('signupConfirmPassword')?.value;
            
            if (!name || !email || !password) {
                showToast('Please fill all fields', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showToast('Passwords do not match', 'error');
                return;
            }
            
            if (password.length < 6) {
                showToast('Password must be at least 6 characters', 'error');
                return;
            }
            
            currentUser = {
                email: email,
                name: name,
                avatar: null,
                createdAt: new Date().toISOString()
            };
            
            localStorage.setItem('bmb_user', JSON.stringify(currentUser));
            closeAuthModal();
            showMainContent();
            loadAllSections();
            showToast(`Welcome to BmbApk, ${name}!`, 'success');
        });
    }
    
    // Google buttons
    const googleLoginBtn = document.getElementById('googleLoginBtn');
    const googleSignupBtn = document.getElementById('googleSignupBtn');
    
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', () => {
            showToast('Google login coming soon!', 'info');
        });
    }
    
    if (googleSignupBtn) {
        googleSignupBtn.addEventListener('click', () => {
            showToast('Google signup coming soon!', 'info');
        });
    }
}

function openAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) modal.classList.add('active');
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) modal.classList.remove('active');
}

// Initialize Profile Modals
function initProfileModals() {
    const userAvatar = document.getElementById('userAvatar');
    const profileModal = document.getElementById('profileModal');
    const closeProfileModal = document.getElementById('closeProfileModal');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const logoutModalBtn = document.getElementById('logoutModalBtn');
    const dropdownProfileBtn = document.getElementById('dropdownProfileBtn');
    const dropdownLogoutBtn = document.getElementById('dropdownLogoutBtn');
    
    // Open profile modal
    if (userAvatar) {
        userAvatar.addEventListener('click', () => {
            if (currentUser) openProfileModal();
            else openAuthModal();
        });
    }
    
    if (dropdownProfileBtn) {
        dropdownProfileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentUser) openProfileModal();
            else openAuthModal();
        });
    }
    
    // Close profile modal
    if (closeProfileModal) {
        closeProfileModal.addEventListener('click', () => {
            profileModal.classList.remove('active');
        });
    }
    
    if (profileModal) {
        profileModal.addEventListener('click', (e) => {
            if (e.target === profileModal) profileModal.classList.remove('active');
        });
    }
    
    // Edit profile
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            profileModal.classList.remove('active');
            openEditProfileModal();
        });
    }
    
    // Logout
    if (logoutModalBtn) {
        logoutModalBtn.addEventListener('click', () => {
            logout();
        });
    }
    
    if (dropdownLogoutBtn) {
        dropdownLogoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
    
    // Edit profile modal
    initEditProfileModal();
}

function openProfileModal() {
    if (!currentUser) return;
    
    // Update profile data
    updateUserUI();
    
    const modal = document.getElementById('profileModal');
    if (modal) modal.classList.add('active');
}

function logout() {
    currentUser = null;
    localStorage.removeItem('bmb_user');
    sessionStorage.removeItem('bmb_user');
    showUnauthorized();
    showToast('Logged out successfully', 'success');
    
    const profileModal = document.getElementById('profileModal');
    if (profileModal) profileModal.classList.remove('active');
}

// Edit Profile Modal
function initEditProfileModal() {
    const editModal = document.getElementById('editProfileModal');
    const closeEditModal = document.getElementById('closeEditModal');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');
    const uploadAvatarBtn = document.getElementById('uploadAvatarBtn');
    const avatarInput = document.getElementById('avatarInput');
    
    if (closeEditModal) {
        closeEditModal.addEventListener('click', () => {
            editModal.classList.remove('active');
        });
    }
    
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', () => {
            editModal.classList.remove('active');
        });
    }
    
    if (editModal) {
        editModal.addEventListener('click', (e) => {
            if (e.target === editModal) editModal.classList.remove('active');
        });
    }
    
    // Change avatar
    const openAvatarInput = () => {
        if (avatarInput) avatarInput.click();
    };
    
    if (changeAvatarBtn) changeAvatarBtn.addEventListener('click', openAvatarInput);
    if (uploadAvatarBtn) uploadAvatarBtn.addEventListener('click', openAvatarInput);
    
    if (avatarInput) {
        avatarInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const avatarUrl = event.target.result;
                    if (currentUser) {
                        currentUser.avatar = avatarUrl;
                        localStorage.setItem('bmb_user', JSON.stringify(currentUser));
                        updateUserUI();
                        showToast('Avatar updated!', 'success');
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Save profile
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', () => {
            const newName = document.getElementById('editName')?.value.trim();
            if (newName && currentUser) {
                currentUser.name = newName;
                localStorage.setItem('bmb_user', JSON.stringify(currentUser));
                updateUserUI();
                editModal.classList.remove('active');
                showToast('Profile updated!', 'success');
            }
        });
    }
}

function openEditProfileModal() {
    if (!currentUser) return;
    
    const editName = document.getElementById('editName');
    const editAvatarImg = document.getElementById('editAvatarImg');
    
    if (editName) editName.value = currentUser.name || '';
    if (editAvatarImg && currentUser.avatar) {
        editAvatarImg.src = currentUser.avatar;
        editAvatarImg.style.display = 'block';
    } else if (editAvatarImg) {
        editAvatarImg.style.display = 'none';
    }
    
    const modal = document.getElementById('editProfileModal');
    if (modal) modal.classList.add('active');
}

// Search History
function initSearchHistory() {
    const searchInput = document.getElementById('searchInput');
    const searchHistoryDropdown = document.getElementById('searchHistoryDropdown');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    
    if (searchInput) {
        searchInput.addEventListener('focus', () => {
            if (currentUser) {
                loadSearchHistory();
                searchHistoryDropdown.classList.add('active');
            }
        });
        
        searchInput.addEventListener('input', debounce(() => {
            handleSearch();
        }, 500));
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    }
    
    document.addEventListener('click', (e) => {
        if (searchHistoryDropdown && !searchHistoryDropdown.contains(e.target) && e.target !== searchInput) {
            searchHistoryDropdown.classList.remove('active');
        }
    });
    
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', () => {
            if (currentUser) {
                localStorage.removeItem(`search_history_${currentUser.email}`);
                loadSearchHistory();
                showToast('Search history cleared', 'success');
            }
        });
    }
}

function loadSearchHistory() {
    if (!currentUser) return;
    
    const history = JSON.parse(localStorage.getItem(`search_history_${currentUser.email}`) || '[]');
    const historyList = document.getElementById('searchHistoryList');
    
    if (!historyList) return;
    
    if (history.length === 0) {
        historyList.innerHTML = '<div class="history-item" style="color: var(--text-muted);">No recent searches</div>';
        return;
    }
    
    historyList.innerHTML = history.map((item, index) => `
        <div class="history-item" data-term="${escapeHtml(item.term)}" data-id="${index}">
            <i class="fas fa-history"></i>
            <span>${escapeHtml(item.term)}</span>
            <i class="fas fa-times delete-history" data-id="${index}"></i>
        </div>
    `).join('');
    
    document.querySelectorAll('.history-item').forEach(el => {
        el.addEventListener('click', async (e) => {
            if (e.target.classList.contains('delete-history')) {
                e.stopPropagation();
                const id = parseInt(e.target.dataset.id);
                const history = JSON.parse(localStorage.getItem(`search_history_${currentUser.email}`) || '[]');
                history.splice(id, 1);
                localStorage.setItem(`search_history_${currentUser.email}`, JSON.stringify(history));
                loadSearchHistory();
            } else {
                const term = el.dataset.term;
                const searchInput = document.getElementById('searchInput');
                if (term && searchInput) {
                    searchInput.value = term;
                    const dropdown = document.getElementById('searchHistoryDropdown');
                    if (dropdown) dropdown.classList.remove('active');
                    handleSearch();
                }
            }
        });
    });
}

function saveSearchHistory(term) {
    if (!currentUser) return;
    
    const history = JSON.parse(localStorage.getItem(`search_history_${currentUser.email}`) || '[]');
    const existingIndex = history.findIndex(item => item.term.toLowerCase() === term.toLowerCase());
    
    if (existingIndex !== -1) {
        history.splice(existingIndex, 1);
    }
    
    history.unshift({ term: term, timestamp: new Date().toISOString() });
    
    if (history.length > 10) history.pop();
    
    localStorage.setItem(`search_history_${currentUser.email}`, JSON.stringify(history));
}

// Search Function
async function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput?.value.trim();
    const searchResultsSection = document.getElementById('searchResultsSection');
    const searchResults = document.getElementById('searchResults');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    
    if (!searchTerm) {
        if (searchResultsSection) searchResultsSection.style.display = 'none';
        return;
    }
    
    if (currentUser) {
        saveSearchHistory(searchTerm);
        loadSearchHistory();
    }
    
    if (searchResultsSection) searchResultsSection.style.display = 'block';
    if (searchResults) {
        searchResults.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';
    }
    
    searchResultsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    if (clearSearchBtn) {
        clearSearchBtn.onclick = () => {
            if (searchInput) searchInput.value = '';
            if (searchResultsSection) searchResultsSection.style.display = 'none';
        };
    }
    
    try {
        const appData = await fetchAppData(searchTerm);
        if (searchResults) searchResults.innerHTML = '';
        
        if (appData && appData.success && appData.result) {
            const card = createGridCard(appData.result, searchTerm);
            if (searchResults) searchResults.appendChild(card);
        } else {
            const matches = ALL_APPS.filter(app => 
                app.toLowerCase().includes(searchTerm.toLowerCase())
            ).slice(0, 8);
            
            if (matches.length > 0 && searchResults) {
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
            } else if (searchResults) {
                searchResults.innerHTML = `
                    <div style="grid-column:1/-1; text-align:center; padding:60px 20px;">
                        <i class="fas fa-search" style="font-size:56px; color:var(--text-muted); margin-bottom:20px;"></i>
                        <h3>No results found</h3>
                        <p style="color:var(--text-muted);">Try searching for another app name</p>
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error('Search error:', error);
        if (searchResults) {
            searchResults.innerHTML = `
                <div style="grid-column:1/-1; text-align:center; padding:60px 20px;">
                    <i class="fas fa-exclamation-triangle" style="font-size:56px; color:var(--warning); margin-bottom:20px;"></i>
                    <h3>Search error</h3>
                    <p style="color:var(--text-muted);">Please try again</p>
                </div>
            `;
        }
    }
}

// Load All Sections
async function loadAllSections() {
    await Promise.all([
        loadHorizontalSection('recommendedGrid', APPS_DATA.recommended),
        loadGridSection('topChartsGrid', APPS_DATA.topCharts),
        loadGridSection('trendingGrid', APPS_DATA.trending),
        loadHorizontalSection('offlineGamesGrid', APPS_DATA.offlineGames)
    ]);
}

async function loadHorizontalSection(containerId, appNames) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
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

async function loadGridSection(containerId, appNames) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
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

// Create Cards
function createHorizontalCard(appData, appName) {
    const card = document.createElement('div');
    card.className = 'app-card-horizontal';
    
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
            <span style="color: var(--text-muted);">★ ${size} MB</span>
        </div>
        <button class="download-btn-play" data-app="${escapeHtml(appName)}" data-url="${appData.download_url || ''}" data-icon="${appData.appicon || ''}" data-developer="${escapeHtml(appData.developer || category)}">
            <i class="fas fa-download"></i> Download
        </button>
    `;
    
    const btn = card.querySelector('.download-btn-play');
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (btn.dataset.url) {
            showDownloadModal(appName, btn.dataset.url, btn.dataset.icon, btn.dataset.developer);
        } else {
            searchAndDownload(appName);
        }
    });
    
    return card;
}

function createGridCard(appData, appName) {
    const card = document.createElement('div');
    card.className = 'app-card-grid';
    
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
            <span style="color: var(--text-muted);">★ ${size} MB</span>
        </div>
        <button class="download-btn-play" data-app="${escapeHtml(appName)}" data-url="${appData.download_url || ''}" data-icon="${appData.appicon || ''}" data-developer="${escapeHtml(appData.developer || category)}">
            <i class="fas fa-download"></i> Download
        </button>
    `;
    
    const btn = card.querySelector('.download-btn-play');
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (btn.dataset.url) {
            showDownloadModal(appName, btn.dataset.url, btn.dataset.icon, btn.dataset.developer);
        } else {
            searchAndDownload(appName);
        }
    });
    
    return card;
}

function createFallbackHorizontalCard(appName) {
    const card = document.createElement('div');
    card.className = 'app-card-horizontal';
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
            <span style="color: var(--text-muted);">★ ${size} MB</span>
        </div>
        <button class="download-btn-play" data-app="${escapeHtml(appName)}" data-url="">
            <i class="fas fa-download"></i> Download
        </button>
    `;
    
    const btn = card.querySelector('.download-btn-play');
    btn.addEventListener('click', () => searchAndDownload(appName));
    
    return card;
}

function createFallbackGridCard(appName) {
    const card = document.createElement('div');
    card.className = 'app-card-grid';
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
            <span style="color: var(--text-muted);">★ ${size} MB</span>
        </div>
        <button class="download-btn-play" data-app="${escapeHtml(appName)}" data-url="">
            <i class="fas fa-download"></i> Download
        </button>
    `;
    
    const btn = card.querySelector('.download-btn-play');
    btn.addEventListener('click', () => searchAndDownload(appName));
    
    return card;
}

function getCategory(appName) {
    const lower = appName.toLowerCase();
    if (lower.includes('game') || lower.includes('subway') || lower.includes('candy')) return 'Game';
    if (lower.includes('ai') || lower.includes('vidu') || lower.includes('hailuo')) return 'AI & Tools';
    if (lower.includes('pesa') || lower.includes('finance')) return 'Finance';
    if (lower.includes('whatsapp') || lower.includes('instagram') || lower.includes('facebook')) return 'Social';
    if (lower.includes('canva') || lower.includes('capcut')) return 'Art & Design';
    return 'App';
}

// Download Modal
function showDownloadModal(appName, downloadUrl, icon, developer) {
    const modal = document.getElementById('downloadModal');
    const appIcon = document.getElementById('downloadAppIcon');
    const appNameEl = document.getElementById('downloadAppName');
    const developerEl = document.getElementById('downloadDeveloper');
    const progressFill = document.getElementById('downloadProgressFill');
    const percentEl = document.getElementById('downloadPercent');
    const speedEl = document.getElementById('downloadSpeed');
    const timeEl = document.getElementById('downloadTime');
    const cancelBtn = document.getElementById('cancelDownloadBtn');
    const openBtn = document.getElementById('openDownloadBtn');
    const closeBtn = document.getElementById('closeDownloadModal');
    
    if (!modal) return;
    
    // Reset
    if (downloadInterval) clearInterval(downloadInterval);
    
    // Set app info
    if (appIcon) {
        if (icon) {
            appIcon.innerHTML = `<img src="${icon}" alt="${appName}" style="width:100%; height:100%; object-fit:cover;">`;
        } else {
            appIcon.innerHTML = `<i class="fas fa-mobile-alt"></i>`;
        }
    }
    if (appNameEl) appNameEl.textContent = appName;
    if (developerEl) developerEl.textContent = developer || 'BmbApk';
    
    // Reset progress
    if (progressFill) progressFill.style.width = '0%';
    if (percentEl) percentEl.textContent = '0%';
    if (speedEl) speedEl.textContent = '0 KB/s';
    if (timeEl) timeEl.textContent = '-- remaining';
    
    // Show cancel, hide open
    if (cancelBtn) cancelBtn.style.display = 'flex';
    if (openBtn) openBtn.style.display = 'none';
    
    // Open modal
    modal.classList.add('active');
    
    // Simulate download
    let progress = 0;
    const startTime = Date.now();
    
    downloadInterval = setInterval(() => {
        progress += Math.random() * 10 + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(downloadInterval);
            
            // Download complete
            if (progressFill) progressFill.style.width = '100%';
            if (percentEl) percentEl.textContent = '100%';
            if (speedEl) speedEl.textContent = 'Complete!';
            if (timeEl) timeEl.textContent = 'Ready to open';
            
            // Show open button, hide cancel
            if (cancelBtn) cancelBtn.style.display = 'none';
            if (openBtn) openBtn.style.display = 'flex';
            
            currentDownload = { appName, downloadUrl };
        }
        
        if (progressFill) progressFill.style.width = `${progress}%`;
        if (percentEl) percentEl.textContent = `${Math.floor(progress)}%`;
        
        // Calculate speed and time
        const elapsed = (Date.now() - startTime) / 1000;
        const speed = (progress / elapsed) * 10;
        if (speedEl && !isNaN(speed)) {
            speedEl.textContent = `${Math.floor(speed)} KB/s`;
        }
        
        const remaining = (100 - progress) / (progress / elapsed);
        if (timeEl && !isNaN(remaining) && remaining < 3600) {
            timeEl.textContent = `${Math.floor(remaining)}s remaining`;
        }
    }, 200);
    
    // Cancel download
    if (cancelBtn) {
        cancelBtn.onclick = () => {
            if (downloadInterval) clearInterval(downloadInterval);
            modal.classList.remove('active');
            showToast('Download cancelled', 'warning');
        };
    }
    
    // Open download
    if (openBtn) {
        openBtn.onclick = () => {
            if (currentDownload && currentDownload.downloadUrl) {
                window.open(currentDownload.downloadUrl, '_blank');
                showToast(`Opening ${currentDownload.appName}...`, 'success');
                modal.classList.remove('active');
            }
        };
    }
    
    // Close modal
    if (closeBtn) {
        closeBtn.onclick = () => {
            if (downloadInterval) clearInterval(downloadInterval);
            modal.classList.remove('active');
        };
    }
    
    modal.onclick = (e) => {
        if (e.target === modal) {
            if (downloadInterval) clearInterval(downloadInterval);
            modal.classList.remove('active');
        }
    };
}

async function searchAndDownload(appName) {
    showToast(`Finding ${appName}...`, 'info');
    
    try {
        const appData = await fetchAppData(appName);
        if (appData && appData.success && appData.result && appData.result.download_url) {
            showDownloadModal(appName, appData.result.download_url, appData.result.appicon, appData.result.developer);
        } else {
            showToast(`Could not find download link for ${appName}`, 'error');
        }
    } catch (error) {
        showToast('Download failed', 'error');
    }
}

// Theme Toggle
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            if (currentTheme === 'light') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            }
        });
    }
}

// Custom Cursor
function initCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    if (!cursor || !cursorFollower) return;
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        cursorFollower.style.transform = `translate(${e.clientX - 15}px, ${e.clientY - 15}px)`;
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorFollower.style.opacity = '0.5';
    });
    
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorFollower.style.opacity = '0';
    });
    
    const links = document.querySelectorAll('a, button, .download-btn-play, .app-card');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursorFollower.style.transform = 'scale(1.2)';
        });
        link.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursorFollower.style.transform = 'scale(1)';
        });
    });
}

// Event Listeners
function initEventListeners() {
    const learnMoreBtn = document.getElementById('learnMoreBtn');
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', () => {
            showToast('BmbApk - Your trusted APK downloader!', 'info');
        });
    }
}

// Toast
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    
    toast.innerHTML = `<i class="fas fa-${icon}"></i> ${escapeHtml(message)}`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Debounce
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

// Escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
