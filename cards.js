// GPK Card Data
const gpkCards = [
    {
        id: 1,
        title: "OS1 Custom Pack",
        series: 1,
        year: 1985,
        imageUrl: "PompaPaulie.png",
        value: 125.00,
        backImage: "20250428204923.png",
        model: "assets/models/os1-card.glb"
    },
    // Add other cards following same structure
];

// Initialize Card Grid
function initCardGrid() {
    const grid = document.getElementById('card-grid');
    
    gpkCards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card-container';
        cardElement.innerHTML = `
            <div class="card-face card-front">
                <div class="card-image" style="background-image: url('${card.imageUrl}')"></div>
                <div class="card-info">
                    <h3 class="card-title">${card.title}</h3>
                    <p>Series ${card.series} • $${card.value.toFixed(2)}</p>
                </div>
            </div>
            <div class="card-face card-back">
                <div class="card-image" style="background-image: url('${card.backImage}')"></div>
            </div>
        `;
        
        cardElement.addEventListener('dblclick', () => {
            open3DViewer(card);
        });
        
        grid.appendChild(cardElement);
    });
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', initCardGrid);
