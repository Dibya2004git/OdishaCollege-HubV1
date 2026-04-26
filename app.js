// 1. Database State
let colleges = []; 

// 2. Data Load Function
async function loadCollegesFromFirebase() {
    try {
        const snapshot = await db.collection("colleges").orderBy("rank", "asc").get();
        colleges = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderHomeColleges(colleges);
        console.log("✅ Database Ready");
    } catch (error) {
        console.error("❌ Error:", error);
    }
}

// 3. UI Renderer (Card Design)
function renderHomeColleges(data) {
    const container = document.getElementById('college-container');
    if (!container) return;
    
    if (data.length === 0) {
        container.innerHTML = `<div class="no-results">Aapke search ke hisaab se koi college nahi mila.</div>`;
        return;
    }

    container.innerHTML = data.map(college => `
        <div class="college-card">
            <img src="${college.image}" alt="${college.name}">
            <div class="card-content">
                <span class="badge">${college.stream}</span>
                <h3>${college.name}</h3>
                <p>📍 ${college.location} • ${college.type}</p>
                <div class="fees">Fees: ${college.fees}</div>
                <button class="view-btn" onclick="goToDetails('${college.id}')">View Details</button>
            </div>
        </div>
    `).join('');
}

// 4. SEARCH FEATURE (Naya)
const searchInput = document.querySelector('.search-bar input');
if(searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = colleges.filter(c => 
            c.name.toLowerCase().includes(term) || 
            c.location.toLowerCase().includes(term)
        );
        renderHomeColleges(filtered);
    });
}

// 5. FILTER FEATURE
window.filterByStream = (stream) => {
    const filtered = stream === 'All' ? colleges : colleges.filter(c => c.stream === stream);
    renderHomeColleges(filtered);
};

// 6. VIEW DETAILS REDIRECT
window.goToDetails = (id) => {
    window.location.href = `college-details.html?id=${id}`;
};

window.addEventListener('DOMContentLoaded', loadCollegesFromFirebase);
