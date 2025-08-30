// Loader on page open for 5 seconds
const pageLoader = document.getElementById('pageLoader');
document.body.style.overflow = "hidden";
setTimeout(() => {
  pageLoader.style.display = "none";
  document.body.style.overflow = "";
}, 5000);

const input = document.getElementById("query");
const searchBtn = document.getElementById("searchBtn");
const results = document.getElementById("results");
const error = document.getElementById("error");
const apkSection = document.getElementById("apkSection");

let apkList = [];
let currentApkIdx = null;

function clearDetails() {
  apkSection.classList.remove("active");
  apkSection.innerHTML = "";
}

async function searchAPKs() {
  clearDetails();
  error.textContent = '';
  results.innerHTML = '<div class="loading">🔄 Loading...</div>';
  const query = input.value.trim();
  if (!query) {
    error.textContent = '❌ Please enter the name of the app.!';
    results.innerHTML = '';
    return;
  }
  try {
    const api = `https://corsproxy.io/?${encodeURIComponent('http://ws75.aptoide.com/api/7/apps/search/query='+encodeURIComponent(query)+'/limit=10')}`;
    const res = await fetch(api);
    const json = await res.json();
    if (!json.datalist?.list?.length) {
      results.innerHTML = '';
      error.textContent = '❌ Hakuna matokeo!';
      return;
    }
    apkList = json.datalist.list;
    results.innerHTML = '';
    apkList.forEach((apk, idx) => {
      const appSizeMB = (apk.size / 1048576).toFixed(2);
      let iconUrl = apk.icon && apk.icon.startsWith('http') ? apk.icon : '';
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <div class="thumb">
          ${iconUrl ? `<img src="${iconUrl}" alt="${apk.name} icon" style="width:100%;height:100%;object-fit:cover;border-radius:10px;" />` : `<span style="color:#00ffe7;font-size:2rem;">📦</span>`}
        </div>
        <div class="meta">
          <h3>${apk.name}</h3>
          <p><strong>Developer:</strong> ${apk.developer?.name || "Unknown"}</p>
          <p><strong>Updated:</strong> ${apk.updated || "Unknown"}</p>
          <p><strong>Size:</strong> ${appSizeMB} MB</p>
          <p><strong>Package:</strong> ${apk.package}</p>
        </div>
      `;
      card.onclick = () => showApkDetails(idx);
      results.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    error.textContent = '❌ Imeshindwa kupata data!';
    results.innerHTML = '';
  }
}

function showApkDetails(idx) {
  const apk = apkList[idx];
  if (!apk) return;
  currentApkIdx = idx;
  const appSizeMB = (apk.size / 1048576).toFixed(2);
  let iconUrl = apk.icon && apk.icon.startsWith('http') ? apk.icon : '';
  apkSection.classList.add("active");
  apkSection.innerHTML = `
    <div style="display:flex;gap:0.8rem;align-items:flex-start;">
      <div style="width:60px;height:60px;border-radius:12px;border:2px solid #00ffe7;box-shadow:0 0 10px #00ffe7;margin-right:7px;background:#222;display:flex;align-items:center;justify-content:center;">
        ${iconUrl ? `<img src="${iconUrl}" alt="${apk.name} icon" style="width:100%;height:100%;object-fit:cover;border-radius:10px;" />` : `<span style="color:#00ffe7;font-size:2rem;">📦</span>`}
      </div>
      <div class="apk-meta">
        <h3>${apk.name}</h3>
        <p><strong>Developer:</strong> ${apk.developer?.name || "Unknown"}</p>
        <p><strong>Updated:</strong> ${apk.updated || "Unknown"}</p>
        <p><strong>Size:</strong> ${appSizeMB} MB</p>
        <p><strong>Package:</strong> ${apk.package}</p>
      </div>
    </div>
    <div class="actions">
      <button onclick="downloadAPK('${apk.file.path_alt}', '${apk.name}', this)">Download APK</button>
    </div>
  `;
  apkSection.scrollIntoView({behavior:"smooth",block:"start"});
}

window.downloadAPK = function(url, name, btn) {
  btn.disabled = true;
  try {
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', `${name}.apk`);
    a.setAttribute('target', '_blank');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (e) {
    alert("❌ Download failed.");
  } finally {
    btn.disabled = false;
  }
}

searchBtn.addEventListener("click", searchAPKs);
input.addEventListener("keydown", e => { if (e.key === "Enter") searchAPKs(); });

window.onload = () => {
  clearDetails();
  results.innerHTML = '<div class="loading">🔍 Search for any Android app above...</div>';
  error.textContent = '';
};
