const map = L.map('map').setView([38.9637, 35.2433], 6); 

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let depremRiskArea; 
const guvenliBolgeler = []; 
let playerMarker; 
let playerScore = 100; 
let gameActive = false; 
let reachedSafeZone = false; 
let startButton; 

function createFaultLines() {
    const faultLines = [
        {
            name: "Kuzey Anadolu Fayı (KAF)",
            coords: [
                [40.0, 26.0],
                [39.7, 27.2],
                [39.5, 28.3],
                [39.0, 29.0],
                [38.5, 30.0],
                [38.0, 30.5]
            ],
            thickness: 6 
        },
        {
            name: "Doğu Anadolu Fayı (DAF)",
            coords: [
                [39.0, 39.0],
                [38.8, 39.5],
                [38.5, 40.0],
                [38.3, 40.5],
                [37.8, 41.0]
            ],
            thickness: 5 
        },
        {
            name: "Güney Anadolu Fayı",
            coords: [
                [37.0, 37.0],
                [36.8, 37.5],
                [36.5, 37.8],
                [36.3, 38.0]
            ],
            thickness: 4 
        },
        {
            name: "Çatalca Fayı",
            coords: [
                [41.0, 28.0],
                [41.1, 28.1],
                [41.2, 28.2],
                [41.3, 28.3]
            ],
            thickness: 3 
        },
        {
            name: "Karadeniz Fay Hattı",
            coords: [
                [41.0, 31.0],
                [41.1, 31.5],
                [41.2, 32.0],
                [41.3, 32.5],
                [41.5, 33.0],
                [41.6, 34.0],
                [41.7, 35.0],
            ],
            thickness: 4 
        }
    ];

    faultLines.forEach(fault => {
    
        L.polyline(fault.coords, {
            color: 'red',
            weight: fault.thickness,
            opacity: 0.8
        }).addTo(map).bindPopup(fault.name);

        fault.coords.forEach(coord => {
            L.marker(coord, {
                icon: L.icon({
                    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1828/1828950.png', 
                    iconSize: [25, 25]
                })
            }).addTo(map).bindPopup('Fay Hattı Uyarısı: ' + fault.name);
        });
    });

    createFaultCities(); 
}

function createFaultCities() {
    const faultCities = [
        { name: "Aksaray", coords: [38.3632, 34.0328] },
        { name: "Balıkesir", coords: [39.65, 27.88] },
        { name: "Bolu", coords: [40.74, 31.62] },
    ];

    faultCities.forEach(city => {
        L.marker(city.coords, {
            icon: L.icon({
                iconUrl: 'https://cdn-icons-png.flaticon.com/512/1828/1828950.png', 
                iconSize: [25, 25]
            })
        }).addTo(map).bindPopup(city.name);
    });
}

function createDepremMerkezi() {
    const randomCoordinates = getRandomCoordinate();
    depremRiskArea = L.marker(randomCoordinates).addTo(map)
        .bindPopup('Deprem Merkez Üssü')
        .openPopup();

    const riskCircle = L.circle(randomCoordinates, {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 50000 
    }).addTo(map);
}

function getRandomCoordinate() {
    const lat = 36 + Math.random() * (42 - 36); 
    const lng = 26 + Math.random() * (45 - 26); 
    return [lat, lng];
}

function createGuvenliBolgeler() {
    const predefinedGuvenliBolgeler = [
        [39.92077, 32.85411],   // Ankara
        [38.4192, 27.1287],     // İzmir
        [40.1828, 29.0669],     // Bursa
        [37.0105, 35.3285],     // Adana
        [41.0034, 28.9757],     // Kocaeli
        [38.3632, 34.0328],     // Aksaray
        [37.8422, 27.3672],     // Aydın
        [40.7388, 31.6266],     // Bolu
        [37.8739, 32.4846],     // Konya
        [37.1842, 33.0132],     // Karaman
        [41.1829, 41.2085],     // Artvin
        [41.0201, 40.5234],     // Rize 
        [41.0015, 39.7178],     // Trabzon 
        [40.5739, 37.3143],     // Ordu
        [40.9128, 38.3895],     // Giresun 
        [39.8212, 34.8156],     // Yozgat
        [41.2867, 36.33],       // Samsun 
        [42.0050, 35.18],       // Sinop
        [41.3825, 33.7793],     // Kastamonu
        [41.5995, 32.4171],     // Bartın
        [41.7342, 27.2529],     // Kırklareli
        [39.9331, 33.5156],     // Kırıkkale
        [39.1843, 34.2015],     // Kırşehir
        [37.7463, 34.5924],     // Niğde
        [37.4522, 41.2138],     // Mardin
        [37.4677, 42.4160],     // Şırnak
        [37.1989, 41.8967],     // Siirt
        [37.8850, 41.6282],     // Batman
        [42.0705, 42.7004],     // Ardahan
        [36.8841, 30.7056],     // Mersin
        [36.8965, 30.7131]      // Antalya
    ];

    predefinedGuvenliBolgeler.forEach(coords => {
        guvenliBolgeler.push(coords);
        L.marker(coords, { 
            icon: L.icon({ 
                iconUrl: 'https://cdn-icons-png.flaticon.com/512/190/190400.png', 
                iconSize: [25, 25] 
            }) 
        })
        .addTo(map)
        .bindPopup('Güvenli Bölge');
    });
}


function startGame() {
    playerScore = 100;
    gameActive = true;
    reachedSafeZone = false; 
    clearMap(); 

    createFaultLines(); 
    createDepremMerkezi(); 
    createGuvenliBolgeler(); 
    setPlayerStart(); 
    addMovementControls(); 
    updateStartButton(); 
}

function endGame() {
    gameActive = false;
    alert("Oyun bitti! Toplam Puanınız: " + playerScore);
    clearMap(); 
    removeMovementControls(); 
    updateStartButton(); 
}

function clearMap() {
    map.eachLayer(layer => {
        if (layer instanceof L.Marker || layer instanceof L.Circle || layer instanceof L.Polyline) {
            map.removeLayer(layer);
        }
    });
}

function setPlayerStart() {
    const randomCoordinates = getRandomCoordinate();
    const safeOffset = 0.05; // 5 km uzaklık
    const depremCoords = depremRiskArea.getLatLng();
    const startLat = depremCoords.lat + safeOffset; 
    const startLng = depremCoords.lng + safeOffset;
    
    playerMarker = L.marker([startLat, startLng], { draggable: true })
        .addTo(map)
        .bindPopup("Başlangıç Konumu: Buradan güvenli bir bölgeye ulaşmaya çalışın.")
        .openPopup();
}

function movePlayer(direction) {
    if (!gameActive) return; 

    const latLng = playerMarker.getLatLng();
    let newLatLng;

    switch (direction) {
        case 'up':
            newLatLng = L.latLng(latLng.lat + 0.1, latLng.lng);
            break;
        case 'down':
            newLatLng = L.latLng(latLng.lat - 0.1, latLng.lng);
            break;
        case 'left':
            newLatLng = L.latLng(latLng.lat, latLng.lng - 0.1);
            break;
        case 'right':
            newLatLng = L.latLng(latLng.lat, latLng.lng + 0.1);
            break;
    }

    playerMarker.setLatLng(newLatLng);
    checkProximityToRisk(newLatLng);
    checkProximityToSafeZone(newLatLng);
}

function checkProximityToRisk(playerLatLng) {
    const distanceToRisk = playerLatLng.distanceTo(depremRiskArea.getLatLng());
    const safeDistance = 10000; 

    if (distanceToRisk < safeDistance) {
        playerScore -= 10; 
        alert("Tehlikeli bölgeye yaklaştınız! Puan kaybettiniz.");
    }
}

function checkProximityToSafeZone(playerLatLng) {
    const safeDistance = 10000; 

    guvenliBolgeler.forEach(coords => {
        const distanceToSafe = playerLatLng.distanceTo(L.latLng(coords));
        if (distanceToSafe < safeDistance && !reachedSafeZone) {
            reachedSafeZone = true; 
            alert("Güvenli bölgeye yaklaştınız!");
        }
        if (distanceToSafe < 500) { 
            gameActive = false;
            alert("Güvenli bölgeye ulaştınız! Tebrikler! Toplam Puanınız: " + playerScore);
        }
    });
}

function addMovementControls() {
    const controls = document.createElement('div');
    controls.classList.add('controls'); 
    controls.innerHTML = `
        <button class="control-button" onclick="movePlayer('up')">Yukarı</button>
        <button class="control-button" onclick="movePlayer('down')">Aşağı</button>
        <button class="control-button" onclick="movePlayer('left')">Sol</button>
        <button class="control-button" onclick="movePlayer('right')">Sağ</button>
        <button class="control-button" onclick="endGame()">Oyunu Bitir</button>
    `;
    document.body.appendChild(controls);
}

function removeMovementControls() {
    const controls = document.querySelector('.controls');
    if (controls) {
        controls.remove(); 
    }
}

function updateStartButton() {
    if (!startButton) {
        startButton = document.createElement('button');
        startButton.classList.add('start-button'); 
        startButton.innerText = "Oyunu Başlat";
        startButton.onclick = startGame;
        document.body.appendChild(startButton);
    } else {
        startButton.style.display = gameActive ? 'none' : 'block'; 
    }
}

updateStartButton();
