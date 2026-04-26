// 1. Database se data store karne ke liye array
let colleges = []; 

// 2. Firebase se Colleges mangwane ka function
async function loadCollegesFromFirebase() {
    try {
        console.log("Database se data fetch ho raha hai...");
        const snapshot = await db.collection("colleges").orderBy("rank", "asc").get();
        
        colleges = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        console.log("✅ Database synced! Total colleges:", colleges.length);
        renderHomeColleges(colleges); // Initial load
    } catch (error) {
        console.error("❌ Firebase Error:", error);
    }
}

// 3. UI par Colleges dikhane ka function
function renderHomeColleges(dataToRender) {
    const container = document.getElementById('college-container');
    if (!container) return;
    
    if (dataToRender.length === 0) {
        container.innerHTML = `<div class="no-results">No colleges found in this category.</div>`;
        return;
    }

    container.innerHTML = dataToRender.map(college => `
        <div class="college-card">
            <img src="${college.image}" alt="${college.name}">
            <div class="card-content">
                <span class="badge">${college.stream}</span>
                <h3>${college.name}</h3>
                <p>📍 ${college.location} • ${college.type}</p>
                <div class="fees">Fees: ${college.fees}</div>
                <button class="view-btn">View Details</button>
            </div>
        </div>
    `).join('');
}

// 4. Global Filter Function (Motive: Law, Arts, Science filters fix)
window.filterByStream = (stream) => {
    console.log("Filtering by:", stream);
    const filtered = stream === 'All' ? colleges : colleges.filter(c => c.stream === stream);
    renderHomeColleges(filtered);
};

// 5. Page load hote hi connect karein
window.addEventListener('DOMContentLoaded', loadCollegesFromFirebase);
