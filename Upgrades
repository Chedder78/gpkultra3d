// Add these new functions to the script section
        function showTrophyRoom() {
            switchView('trophy');
            document.getElementById('trophy-room').setAttribute('visible', 'true');
            
            // Move camera to trophy room
            document.getElementById('camera-rig').setAttribute('animation', {
                property: 'position',
                to: '3 1.6 0',
                dur: 1000,
                easing: 'easeInOutQuad'
            });
            
            // Populate rare cards display
            const rareCards = cardData.filter(card => card.rarity === 'Ultra Rare');
            const rareDisplay = document.getElementById('rare-cards-display');
            
            rareCards.forEach((card, index) => {
                const cardEntity = document.createElement('a-entity');
                cardEntity.setAttribute('position', `${(index % 3) * 0.8 - 0.8} ${Math.floor(index / 3) * -1.2} 0`);
                
                const cardImage = document.createElement('a-image');
                cardImage.setAttribute('src', `#card-${card.id}-front`);
                cardImage.setAttribute('width', '0.7');
                cardImage.setAttribute('height', '1');
                cardImage.setAttribute('class', 'clickable-card');
                cardImage.setAttribute('data-card-id', card.id);
                
                cardEntity.appendChild(cardImage);
                rareDisplay.appendChild(cardEntity);
            });
            
            // Populate achievements
            const achievements = [
                { title: "First Card", earned: true },
                { title: "Complete Series 1", earned: true },
                { title: "5 Ultra Rares", earned: false },
                { title: "Trade Master", earned: true },
                { title: "Pack Addict", earned: false },
                { title: "Vintage Collector", earned: true }
            ];
            
            const achievementsList = document.getElementById('achievements-list');
            
            achievements.forEach(achievement => {
                const achievementEntity = document.createElement('a-entity');
                achievementEntity.setAttribute('layout', 'type: line; margin: 0.2');
                
                const icon = document.createElement('a-image');
                icon.setAttribute('src', achievement.earned ? '#trophy-icon' : '#locked-icon');
                icon.setAttribute('width', '0.3');
                icon.setAttribute('height', '0.3');
                
                const text = document.createElement('a-text');
                text.setAttribute('value', achievement.title);
                text.setAttribute('color', achievement.earned ? '#FFDE37' : '#666666');
                text.setAttribute('align', 'left');
                text.setAttribute('position', '0.4 0 0');
                text.setAttribute('width', '1.5');
                
                achievementEntity.appendChild(icon);
                achievementEntity.appendChild(text);
                achievementsList.appendChild(achievementEntity);
            });
        }

        function showPackOpening() {
            switchView('pack');
            document.getElementById('pack-opening').setAttribute('visible', 'true');
            
            // Move camera to pack opening area
            document.getElementById('camera-rig').setAttribute('animation', {
                property: 'position',
                to: '-3 1.6 0',
                dur: 1000,
                easing: 'easeInOutQuad'
            });
            
            // Set up pack dragging
            const packDisplay = document.getElementById('pack-display');
            packDisplay.setAttribute('draggable', '');
            packDisplay.addEventListener('drag-start', function() {
                this.setAttribute('animation__float', 'property: position; to: 0 2 -1; dur: 500; easing: easeInOutQuad');
            });
            
            packDisplay.addEventListener('drag-end', function() {
                const openingArea = document.getElementById('opening-area').object3D;
                const packPosition = this.object3D.position;
                
                if (openingArea.position.distanceTo(packPosition) < 1.5) {
                    openPack();
                } else {
                    this.setAttribute('animation__return', 'property: position; to: 0 1.5 -1; dur: 500; easing: easeInOutQuad');
                }
            });
            
            // Set up open pack button
            document.getElementById('open-pack-btn').addEventListener('click', openPack);
        }

        function openPack() {
            // Play pack opening sound
            const sound = document.createElement('a-sound');
            sound.setAttribute('src', '#pack-open-sound');
            sound.setAttribute('autoplay', 'true');
            document.querySelector('a-scene').appendChild(sound);
            
            // Animate pack opening
            const pack = document.getElementById('pack-display');
            pack.setAttribute('animation__open', {
                property: 'scale',
                to: '0.1 0.1 0.1',
                dur: 500,
                easing: 'easeInBack'
            });
            
            // Show cards from pack
            setTimeout(() => {
                pack.setAttribute('visible', 'false');
                
                // Generate random cards from the set
                const cardsFromPack = [];
                const availableCards = [...cardData];
                
                // Get 5 random cards (or all cards if less than 5)
                const numCards = Math.min(5, availableCards.length);
                for (let i = 0; i < numCards; i++) {
                    const randomIndex = Math.floor(Math.random() * availableCards.length);
                    cardsFromPack.push(availableCards[randomIndex]);
                    availableCards.splice(randomIndex, 1);
                }
                
                // Display the cards
                const openingArea = document.getElementById('opening-area');
                cardsFromPack.forEach((card, index) => {
                    const cardEntity = document.createElement('a-entity');
                    cardEntity.setAttribute('position', {
                        x: (index - (numCards - 1) / 2) * 0.6,
                        y: 0.1,
                        z: -1
                    });
                    cardEntity.setAttribute('rotation', '0 0 0');
                    cardEntity.setAttribute('scale', '0.1 0.1 0.1');
                    cardEntity.setAttribute('animation', {
                        property: 'scale',
                        to: '1 1 1',
                        dur: 500,
                        delay: index * 100,
                        easing: 'easeOutElastic'
                    });
                    
                    const cardImage = document.createElement('a-image');
                    cardImage.setAttribute('src', `#card-${card.id}-front`);
                    cardImage.setAttribute('width', '0.5');
                    cardImage.setAttribute('height', '0.7');
                    cardImage.setAttribute('class', 'clickable-card');
                    cardImage.setAttribute('data-card-id', card.id);
                    
                    cardEntity.appendChild(cardImage);
                    openingArea.appendChild(cardEntity);
                    
                    // Add to collection if not already present
                    if (!cardData.some(c => c.id === card.id)) {
                        cardData.push(card);
                        updateCollectionStats();
                    }
                });
                
                // Show "New Card" animation for any new cards
                setTimeout(() => {
                    cardsFromPack.forEach((card, index) => {
                        if (!cardData.some(c => c.id === card.id)) {
                            const newBadge = document.createElement('a-entity');
                            newBadge.setAttribute('position', {
                                x: (index - (numCards - 1) / 2) * 0.6,
                                y: 0.6,
                                z: -1
                            });
                            newBadge.setAttribute('text', {
                                value: 'NEW!',
                                color: '#FF3E41',
                                align: 'center',
                                width: 1
                            });
                            newBadge.setAttribute('animation', {
                                property: 'position.y',
                                to: '0.8',
                                dur: 1000,
                                dir: 'alternate',
                                loop: true,
                                easing: 'easeInOutSine'
                            });
                            openingArea.appendChild(newBadge);
                        }
                    });
                }, 1000);
            }, 500);
        }

        function showSocialHub() {
            switchView('social');
            document.getElementById('social-hub').setAttribute('visible', 'true');
            
            // Move camera to social hub
            document.getElementById('camera-rig').setAttribute('animation', {
                property: 'position',
                to: '0 1.6 7',
                dur: 1000,
                easing: 'easeInOutQuad'
            });
            
            // Simulate live trades
            const liveTrades = [
                { user: "Collector42", wants: "OS1 Custom Pack", offers: "Wacky Packages 2024" },
                { user: "GarbageKing", wants: "GPK OS2", offers: "3 Series 1 Cards" },
                { user: "WackyLover", wants: "Any Vintage", offers: "5 Modern Cards" }
            ];
            
            const liveTradesElement = document.getElementById('live-trades');
            
            liveTrades.forEach((trade, index) => {
                const tradeEntity = document.createElement('a-entity');
                tradeEntity.setAttribute('position', {
                    x: Math.cos(index / liveTrades.length * Math.PI * 2) * 0.8,
                    y: 0,
                    z: Math.sin(index / liveTrades.length * Math.PI * 2) * 0.8
                });
                tradeEntity.setAttribute('rotation', '0 0 0');
                tradeEntity.setAttribute('text', {
                    value: `${trade.user}\nWants: ${trade.wants}\nOffers: ${trade.offers}`,
                    color: '#FFFFFF',
                    align: 'center',
                    width: 1.2,
                    wrapCount: 15
                });
                tradeEntity.setAttribute('class', 'clickable');
                tradeEntity.addEventListener('click', () => {
                    alert(`Responding to ${trade.user}'s trade offer`);
                });
                
                liveTradesElement.appendChild(tradeEntity);
            });
            
            // Simulate leaderboard
            const leaderboard = [
                { rank: 1, name: "GPKMaster", score: 1250 },
                { rank: 2, name: "WackyQueen", score: 980 },
                { rank: 3, name: "UltraCollector", score: 875 },
                { rank: 4, name: "VintageHunter", score: 760 },
                { rank: 5, name: "CardDude", score: 720 }
            ];
            
            const leaderboardElement = document.getElementById('leaderboard-entries');
            
            leaderboard.forEach(entry => {
                const entryEntity = document.createElement('a-entity');
                entryEntity.setAttribute('layout', 'type: line; margin: 0.1');
                
                const rank = document.createElement('a-text');
                rank.setAttribute('value', `${entry.rank}.`);
                rank.setAttribute('color', entry.rank <= 3 ? '#FFDE37' : '#FFFFFF');
                rank.setAttribute('width', '0.3');
                
                const name = document.createElement('a-text');
                name.setAttribute('value', entry.name);
                name.setAttribute('color', entry.rank <= 3 ? '#FFDE37' : '#FFFFFF');
                name.setAttribute('width', '1');
                name.setAttribute('position', '0.4 0 0');
                
                const score = document.createElement('a-text');
                score.setAttribute('value', entry.score);
                score.setAttribute('color', entry.rank <= 3 ? '#FFDE37' : '#FFFFFF');
                score.setAttribute('width', '0.7');
                score.setAttribute('position', '1.5 0 0');
                
                entryEntity.appendChild(rank);
                entryEntity.appendChild(name);
                entryEntity.appendChild(score);
                leaderboardElement.appendChild(entryEntity);
            });
            
            // Simulate chat messages
            const chatMessages = [
                { user: "GPKMaster", text: "Just pulled an OS1 Custom Pack!" },
                { user: "WackyQueen", text: "Anyone trading Series 15?" },
                { user: "CardDude", text: "Check out my new complete set!" },
                { user: "VintageHunter", text: "Looking for 1985 vintage cards" }
            ];
            
            const chatElement = document.getElementById('chat-messages');
            
            chatMessages.forEach(message => {
                const messageEntity = document.createElement('a-entity');
                messageEntity.setAttribute('text', {
                    value: `${message.user}: ${message.text}`,
                    color: '#FFFFFF',
                    align: 'left',
                    width: 3.5,
                    wrapCount: 30
                });
                chatElement.appendChild(messageEntity);
            });
        }

        // Update the switchView function to include new views
        function switchView(view) {
            if (currentView === view) return;
            
            currentView = view;
            
            // Hide all views first
            document.getElementById('main-display').setAttribute('visible', 'false');
            document.getElementById('gallery-wall').setAttribute('visible', 'false');
            document.getElementById('trade-center').setAttribute('visible', 'false');
            document.getElementById('trophy-room').setAttribute('visible', 'false');
            document.getElementById('pack-opening').setAttribute('visible', 'false');
            document.getElementById('social-hub').setAttribute('visible', 'false');
            
            // Show the selected view
            switch(view) {
                case 'main':
                    document.getElementById('main-display').setAttribute('visible', 'true');
                    // Move camera to main view
                    document.getElementById('camera-rig').setAttribute('animation', {
                        property: 'position',
                        to: '0 1.6 0',
                        dur: 1000,
                        easing: 'easeInOutQuad'
                    });
                    break;
                    
                case 'gallery':
                    document.getElementById('gallery-wall').setAttribute('visible', 'true');
                    // Move camera to gallery view
                    document.getElementById('camera-rig').setAttribute('animation', {
                        property: 'position',
                        to: '0 1.6 -7',
                        dur: 1000,
                        easing: 'easeInOutQuad'
                    });
                    // Populate gallery if empty
                    if (document.getElementById('gallery-grid').children.length === 0) {
                        populateGallery();
                    }
                    break;
                    
                case 'trade':
                    document.getElementById('trade-center').setAttribute('visible', 'true');
                    // Move camera to trade center
                    document.getElementById('camera-rig').setAttribute('animation', {
                        property: 'position',
                        to: '0 1.6 2',
                        dur: 1000,
                        easing: 'easeInOutQuad'
                    });
                    tradeMode = true;
                    break;
                    
                case 'trophy':
                    showTrophyRoom();
                    break;
                    
                case 'pack':
                    showPackOpening();
                    break;
                    
                case 'social':
                    showSocialHub();
                    break;
            }
        }

        // Add these new assets to the <a-assets> section
        <img id="pack-texture" src="https://example.com/pack-texture.jpg">
        <img id="wood-texture" src="https://example.com/wood-texture.jpg">
        <img id="chalkboard-texture" src="https://example.com/chalkboard-texture.jpg">
        <img id="trophy-icon" src="https://example.com/trophy-icon.png">
        <img id="locked-icon" src="https://example.com/locked-icon.png">
        <audio id="pack-open-sound" src="https://example.com/pack-open.mp3" preload="auto"></audio>

        // Update the navigation controls in setupUI()
        document.getElementById('trophy-btn').addEventListener('click', () => {
            switchView('trophy');
        });
        
        document.getElementById('pack-btn').addEventListener('click', () => {
            switchView('pack');
        });
        
        document.getElementById('social-btn').addEventListener('click', () => {
            switchView('social');
        });
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GPK ULTRA 3D | Collector's Hub</title>
    <script src="https://aframe.io/releases/1.3.0/aframe.min.js"></script>
    <style>
        :root {
            --gpk-red: #ff3e41;
            --gpk-yellow: #ffde37;
            --gpk-blue: #2e86ab;
            --gpk-black: #1a1a1a;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Bangers', cursive, sans-serif;
        }
        
        body {
            background-color: var(--gpk-black);
            color: white;
            overflow-x: hidden;
        }

        #loading-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--gpk-black);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 1s;
        }
        
        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 5px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: var(--gpk-red);
            animation: spin 1s ease-in-out infinite;
            margin-bottom: 20px;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        a-scene {
            position: fixed !important;
            width: 100% !important;
            height: 100% !important;
        }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Bangers&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Loading Screen -->
    <div id="loading-screen">
        <div class="loading-spinner"></div>
        <h2>LOADING GPK ULTRA 3D UNIVERSE...</h2>
    </div>

    <!-- A-Frame Scene -->
    <a-scene loading-screen="enabled: false" renderer="colorManagement: true">
        <!-- Basic Environment -->
        <a-entity environment="preset: default; groundColor: #222222; grid: none"></a-entity>
        
        <!-- Lighting -->
        <a-entity light="type: ambient; color: #444; intensity: 0.5"></a-entity>
        <a-entity light="type: directional; color: #FFDE37; intensity: 0.8" position="-1 2 1"></a-entity>
        
        <!-- Camera -->
        <a-entity id="camera-rig" position="0 1.6 0">
            <a-entity camera="active: true" look-controls="pointerLockEnabled: true" position="0 1.6 0" wasd-controls="acceleration: 100">
                <a-entity cursor="fuse: true; fuseTimeout: 500" position="0 0 -1" geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.03" material="color: #FFDE37; shader: flat"></a-entity>
            </a-entity>
        </a-entity>
        
        <!-- Simple Card Display -->
        <a-entity id="card-display" position="0 1.5 -3">
            <a-image src="#card-front" width="1" height="1.4" position="0 0 0" rotation="0 0 0"></a-image>
            <a-text value="GPK ULTRA" position="0 1.8 0" color="#FFDE37" align="center" width="3"></a-text>
        </a-entity>
        
        <!-- Assets -->
        <a-assets>
            <!-- Use placeholder images that will actually load -->
            <img id="card-front" src="https://upload.wikimedia.org/wikipedia/en/thumb/4/4f/Garbage_Pail_Kids_Logo.svg/1200px-Garbage_Pail_Kids_Logo.svg.png">
        </a-assets>
    </a-scene>

    <script>
        // Hide loading screen when scene is ready
        document.querySelector('a-scene').addEventListener('loaded', function() {
            document.getElementById('loading-screen').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loading-screen').style.display = 'none';
            }, 1000);
        });
    </script>
</body>
</html>
