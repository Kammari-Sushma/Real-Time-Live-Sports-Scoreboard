// ============================================
// DOM ELEMENTS
// ============================================
const heroTimerEl = document.getElementById('hero-timer');
const heroScoreHomeEl = document.getElementById('hero-score-home');
const heroScoreAwayEl = document.getElementById('hero-score-away');
const secondaryMatchesContainer = document.getElementById('secondary-matches-container');

// ============================================
// 1. LIVE CLOCK TICKER
// ============================================
let localClock = { minutes: 72, seconds: 14 };

function formatTime(val) {
    return val < 10 ? `0${val}` : val;
}

// Tick the visual clock every second
setInterval(() => {
    localClock.seconds++;
    if (localClock.seconds >= 60) {
        localClock.seconds = 0;
        localClock.minutes++;
    }
    heroTimerEl.innerText = `${formatTime(localClock.minutes)}:${formatTime(localClock.seconds)}`;
}, 1000);

// ============================================
// 2. LIVE MATCH DATA HANDLING (Simulation)
// ============================================
async function fetchLiveScores() {
    try {
        const data = await simulateAPIResponse();
        updateHeroScoreboard(data.mainMatch);
        updateSecondaryMatches(data.otherMatches);
    } catch (error) {
        console.error("Error fetching live data:", error);
    }
}

function updateHeroScoreboard(match) {
    const currentHomeScore = parseInt(heroScoreHomeEl.innerText);
    const currentAwayScore = parseInt(heroScoreAwayEl.innerText);

    if (match.score.home > currentHomeScore) {
        heroScoreHomeEl.innerText = match.score.home;
        triggerGoalAnimation(heroScoreHomeEl);
    }
    if (match.score.away > currentAwayScore) {
        heroScoreAwayEl.innerText = match.score.away;
        triggerGoalAnimation(heroScoreAwayEl);
    }

    // Sync local visual clock with the database minutes
    localClock.minutes = match.minutes;
}

function updateSecondaryMatches(matches) {
    secondaryMatchesContainer.innerHTML = ''; 
    matches.forEach(match => {
        const cardHTML = `
            <div class="match-card">
                <div class="card-header">
                    <span>${match.league}</span>
                    <span class="card-time">LIVE ${match.minutes}'</span>
                </div>
                <div class="card-body">
                    <div class="card-team"><span>${match.homeTeam}</span> <span class="card-score">${match.homeScore}</span></div>
                    <div class="card-team"><span>${match.awayTeam}</span> <span class="card-score">${match.awayScore}</span></div>
                </div>
            </div>
        `;
        secondaryMatchesContainer.insertAdjacentHTML('beforeend', cardHTML);
    });
}

function triggerGoalAnimation(element) {
    element.classList.add('score-updated');
    setTimeout(() => element.classList.remove('score-updated'), 1000);
}

// ============================================
// 3. NAVIGATION (Single Page Application Logic)
// ============================================
const navLinks = document.querySelectorAll('nav a');
const sections = {
    'Live Now': document.getElementById('live-sections'),
    'Highlights': document.getElementById('highlights-section'),
    'Standings': document.getElementById('standings-section')
};

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.innerText;

        // Update active menu highlight
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Hide all sections, then show the requested one
        Object.values(sections).forEach(sec => sec.style.display = 'none');
        sections[target].style.display = 'block';
    });
});

// ============================================
// 4. MOCK DATA & CONTENT INITIALIZERS
// ============================================

// --- Video Highlights Logic (Using Real, Embeddable Links) ---
const mockHighlights = [
    { 
        title: "EA SPORTS FC 24 | Official Gameplay Trailer", 
        desc: "Next-gen football gaming highlights.", 
        videoUrl: "https://www.youtube.com/watch?v=XhP3Xh4LMA8" 
    },
    { 
        title: "GoPro: Best of 2023", 
        desc: "Incredible extreme sports moments.", 
        videoUrl: "https://www.youtube.com/watch?v=wTcNtgA6gHs"
    },
    { 
        title: "Red Bull Rampage | Insane Downhill Run", 
        desc: "The craziest mountain bike tricks.", 
        videoUrl: "https://www.youtube.com/watch?v=xQ_IQS3VKjA"
    }
];

// Helper to convert standard youtube links into embed links safely
function getEmbedUrl(url) {
    if (url.includes('youtube.com/watch?v=')) {
        const id = url.split('v=')[1];
        return `https://www.youtube.com/embed/${id}`;
    }
    return url;
}

function initHighlights() {
    const container = document.getElementById('highlights-container');
    container.innerHTML = ''; // Clear default

    mockHighlights.forEach(h => {
        const embedUrl = getEmbedUrl(h.videoUrl);
        const cardHTML = `
            <div class="highlight-card">
                <div class="video-wrapper">
                    <iframe 
                        src="${embedUrl}" 
                        title="${h.title}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowfullscreen>
                    </iframe>
                </div>
                <div class="highlight-info">
                    <h4>${h.title}</h4>
                    <p>${h.desc}</p>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cardHTML);
    });
}

// --- Standings Data Logic ---
const mockStandings = [
    { pos: 1, team: "Real Madrid", logo: "https://crests.football-data.org/86.png", mp: 33, w: 26, d: 6, l: 1, gf: 74, ga: 22, gd: 52, pts: 84 },
    { pos: 2, team: "Barcelona", logo: "https://crests.football-data.org/81.png", mp: 33, w: 22, d: 7, l: 4, gf: 68, ga: 39, gd: 29, pts: 73 },
    { pos: 3, team: "Girona", logo: "https://crests.football-data.org/298.png", mp: 33, w: 22, d: 5, l: 6, gf: 69, ga: 40, gd: 29, pts: 71 },
    { pos: 4, team: "Atlético Madrid", logo: "https://crests.football-data.org/78.png", mp: 33, w: 19, d: 4, l: 10, gf: 62, ga: 39, gd: 23, pts: 61 }
];

function initStandings() {
    const tbody = document.getElementById('standings-body');
    tbody.innerHTML = mockStandings.map(s => `
        <tr>
            <td class="pos-col">${s.pos}</td>
            <td>
                <div class="team-cell">
                    <img src="${s.logo}" class="mini-logo">
                    ${s.team}
                </div>
            </td>
            <td>${s.mp}</td>
            <td>${s.w}</td>
            <td>${s.d}</td>
            <td>${s.l}</td>
            <td>${s.gf}</td>
            <td>${s.ga}</td>
            <td>${s.gd}</td>
            <td class="pts-col">${s.pts}</td>
        </tr>
    `).join('');
}

// --- Fake Backend Simulation (Generates random live events) ---
let mockMainMatch = { score: { home: 2, away: 1 }, minutes: 72 };
let mockOtherMatches = [
    { league: "Premier League", homeTeam: "Arsenal", awayTeam: "Chelsea", homeScore: 1, awayScore: 0, minutes: 45 },
    { league: "Serie A", homeTeam: "Juventus", awayTeam: "AC Milan", homeScore: 0, awayScore: 0, minutes: 12 },
    { league: "La Liga", homeTeam: "Barcelona", awayTeam: "Sevilla", homeScore: 3, awayScore: 1, minutes: 88 }
];

function simulateAPIResponse() {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Give a 10% chance for a random goal to simulate live updates
            if (Math.random() > 0.9) mockMainMatch.score.home += 1;
            else if (Math.random() < 0.1) mockMainMatch.score.away += 1;

            resolve({
                mainMatch: mockMainMatch,
                otherMatches: mockOtherMatches
            });
        }, 500); 
    });
}

// ============================================
// 5. BOOTSTRAP / INITIALIZATION
// ============================================
initHighlights();
initStandings();

// Fetch live scores immediately, then check every 10 seconds for updates
fetchLiveScores();
setInterval(fetchLiveScores, 10000);