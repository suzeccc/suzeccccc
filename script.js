// 原神抽奖系统脚本

// 抽奖池示例数据
const pool = [
    // 5星角色
    { name: '流浪者', type: '角色', star: 5, img: 'https://static.wikia.nocookie.net/gensin-impact/images/2/2e/Character_Wanderer_Card.png', up: true },
    // 4星角色
    { name: '砂糖', type: '角色', star: 4, img: 'https://static.wikia.nocookie.net/gensin-impact/images/2/2d/Character_Sucrose_Card.png' },
    { name: '香菱', type: '角色', star: 4, img: 'https://static.wikia.nocookie.net/gensin-impact/images/2/2a/Character_Xiangling_Card.png' },
    // 3星武器
    { name: '冷刃', type: '武器', star: 3, img: 'https://static.wikia.nocookie.net/gensin-impact/images/7/7e/Weapon_Cool_Steel.png' },
    { name: '黎明神剑', type: '武器', star: 3, img: 'https://static.wikia.nocookie.net/gensin-impact/images/2/2a/Weapon_Harbinger_of_Dawn.png' },
];

// 概率设置
const rates = {
    5: 0.006, // 0.6%
    4: 0.051, // 5.1%
    3: 0.943  // 94.3%
};

let primogems = 1600;
let fate = 0;
let wishHistory = [];
let inventory = { character: {}, weapon: {} };

function getRandomStar() {
    const rand = Math.random();
    if (rand < rates[5]) return 5;
    if (rand < rates[5] + rates[4]) return 4;
    return 3;
}

function getRandomItem(star) {
    const candidates = pool.filter(item => item.star === star);
    // 5星有up
    if (star === 5) {
        const up = candidates.find(item => item.up);
        return Math.random() < 0.5 && up ? up : candidates[Math.floor(Math.random() * candidates.length)];
    }
    return candidates[Math.floor(Math.random() * candidates.length)];
}

function addToInventory(item) {
    const key = item.type === '角色' ? 'character' : 'weapon';
    if (!inventory[key][item.name]) {
        inventory[key][item.name] = { ...item, count: 1 };
    } else {
        inventory[key][item.name].count++;
    }
}

function updateInventoryUI() {
    const charDiv = document.getElementById('character-inventory');
    const weapDiv = document.getElementById('weapon-inventory');
    charDiv.innerHTML = '';
    weapDiv.innerHTML = '';
    Object.values(inventory.character).forEach(item => {
        charDiv.innerHTML += `<div class="inventory-item"><img src="${item.img}" alt="${item.name}"><div class="name">${item.name}</div><div class="count">${item.count}</div></div>`;
    });
    Object.values(inventory.weapon).forEach(item => {
        weapDiv.innerHTML += `<div class="inventory-item"><img src="${item.img}" alt="${item.name}"><div class="name">${item.name}</div><div class="count">${item.count}</div></div>`;
    });
}

function updateWishHistoryUI() {
    const historyDiv = document.getElementById('wish-history-list');
    historyDiv.innerHTML = '';
    wishHistory.slice(-20).reverse().forEach(entry => {
        historyDiv.innerHTML += `<div class="wish-history-item ${entry.star === 5 ? 'five-star' : entry.star === 4 ? 'four-star' : ''}"><span>${entry.name}（${entry.type}）</span><span class="time">${entry.time}</span></div>`;
    });
}

function updateWishResultsUI(results) {
    const resultsDiv = document.getElementById('wish-results');
    resultsDiv.innerHTML = '';
    results.forEach(item => {
        resultsDiv.innerHTML += `<div class="wish-item ${item.star === 5 ? 'five-star' : item.star === 4 ? 'four-star' : ''}"><img src="${item.img}" alt="${item.name}"><div class="name">${item.name}</div><div class="type">${item.type} · ${item.star}★</div></div>`;
    });
}

function updateResourceUI() {
    document.getElementById('primogem-count').textContent = primogems;
    document.getElementById('fate-count').textContent = fate;
}

function wish(times) {
    // 每次消耗1抽奖次数
    if (fate < times) {
        alert('抽奖次数不足！');
        return;
    }
    fate -= times;
    updateResourceUI();
    const results = [];
    for (let i = 0; i < times; i++) {
        const star = getRandomStar();
        const item = getRandomItem(star);
        addToInventory(item);
        const now = new Date();
        wishHistory.push({ ...item, time: now.toLocaleString() });
        results.push(item);
    }
    updateWishResultsUI(results);
    updateInventoryUI();
    updateWishHistoryUI();
}

document.getElementById('wish-once').onclick = () => wish(1);
document.getElementById('wish-ten').onclick = () => wish(10);

document.querySelector('.get-fate-title').onclick = function() {
    fate += 10;
    updateResourceUI();
};

// 初始化
updateResourceUI();
updateInventoryUI();
updateWishHistoryUI(); 