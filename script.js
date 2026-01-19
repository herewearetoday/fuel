// Food Inventory Tracker - Main JavaScript

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    initializeForms();
    setDefaultDates();
    loadInventory();
    setupFilters();
});

// ===== DATA MANAGEMENT =====

// Get inventory from localStorage
function getInventory() {
    const data = localStorage.getItem('foodInventory');
    return data ? JSON.parse(data) : [];
}

// Save inventory to localStorage
function saveInventory(inventory) {
    localStorage.setItem('foodInventory', JSON.stringify(inventory));
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ===== TAB MANAGEMENT =====

function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and content
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Show corresponding content
            const tabId = button.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');

            // Refresh inventory if switching to inventory tab
            if (tabId === 'inventory') {
                renderInventory();
            }
        });
    });
}

// ===== FORM MANAGEMENT =====

function initializeForms() {
    // Manual entry form
    document.getElementById('manual-form').addEventListener('submit', (e) => {
        e.preventDefault();
        addManualItem();
    });

    // Receipt form
    document.getElementById('receipt-form').addEventListener('submit', (e) => {
        e.preventDefault();
        addFromReceipt();
    });
}

function setDefaultDates() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('purchase-date').value = today;
    document.getElementById('receipt-date').value = today;
}

// ===== ADD ITEMS =====

function addManualItem() {
    const name = document.getElementById('food-name').value.trim();
    const category = document.getElementById('category').value;
    const purchaseDate = document.getElementById('purchase-date').value;
    const unopenedDays = parseInt(document.getElementById('unopened-days').value);
    const openedDays = parseInt(document.getElementById('opened-days').value);
    const quantity = parseInt(document.getElementById('quantity').value);
    const isOpened = document.getElementById('is-opened').checked;

    const item = {
        id: generateId(),
        name,
        category,
        purchaseDate,
        unopenedDays,
        openedDays,
        quantity,
        isOpened,
        openedDate: isOpened ? purchaseDate : null,
        addedAt: new Date().toISOString()
    };

    // Add to inventory
    const inventory = getInventory();
    inventory.push(item);
    saveInventory(inventory);

    // Reset form
    document.getElementById('manual-form').reset();
    setDefaultDates();

    // Show success message
    showNotification(`✓ ${name} added to inventory!`, 'success');

    // Switch to inventory tab
    switchToInventoryTab();
}

function addFromReceipt() {
    const receiptText = document.getElementById('receipt-text').value.trim();
    const purchaseDate = document.getElementById('receipt-date').value;

    if (!receiptText) {
        showNotification('Please enter at least one item', 'error');
        return;
    }

    const lines = receiptText.split('\n').filter(line => line.trim());
    const inventory = getInventory();
    let addedCount = 0;

    lines.forEach(line => {
        const parts = line.split(',').map(p => p.trim());
        if (parts.length === 0 || !parts[0]) return;

        const name = parts[0];
        const unopenedDays = parts[1] ? parseInt(parts[1]) : 30; // Default 30 days unopened
        const openedDays = parts[2] ? parseInt(parts[2]) : 7;    // Default 7 days opened

        // Try to guess category based on common food names
        const category = guessCategory(name);

        const item = {
            id: generateId(),
            name,
            category,
            purchaseDate,
            unopenedDays,
            openedDays,
            quantity: 1,
            isOpened: false,
            openedDate: null,
            addedAt: new Date().toISOString()
        };

        inventory.push(item);
        addedCount++;
    });

    saveInventory(inventory);

    // Reset form
    document.getElementById('receipt-form').reset();
    setDefaultDates();

    // Show success message
    showNotification(`✓ ${addedCount} items added to inventory!`, 'success');

    // Switch to inventory tab
    switchToInventoryTab();
}

// Simple category guessing based on keywords
function guessCategory(name) {
    const nameLower = name.toLowerCase();

    if (nameLower.match(/milk|cheese|yogurt|butter|cream/)) return 'dairy';
    if (nameLower.match(/apple|banana|orange|lettuce|tomato|carrot|vegetable|fruit/)) return 'produce';
    if (nameLower.match(/chicken|beef|pork|fish|salmon|turkey|meat/)) return 'meat';
    if (nameLower.match(/ice cream|frozen|pizza/)) return 'frozen';
    if (nameLower.match(/juice|soda|water|coffee|tea/)) return 'beverages';
    if (nameLower.match(/bread|rice|pasta|cereal|flour|sugar|oil/)) return 'pantry';

    return 'other';
}

// ===== INVENTORY DISPLAY =====

function loadInventory() {
    renderInventory();
}

function renderInventory(filter = null) {
    const inventory = getInventory();
    const inventoryList = document.getElementById('inventory-list');

    // Apply filters
    let filteredItems = inventory;

    if (filter) {
        if (filter.search) {
            const searchLower = filter.search.toLowerCase();
            filteredItems = filteredItems.filter(item =>
                item.name.toLowerCase().includes(searchLower)
            );
        }

        if (filter.status && filter.status !== 'all') {
            filteredItems = filteredItems.filter(item => {
                const status = calculateStatus(item);
                return status === filter.status;
            });
        }

        if (filter.category && filter.category !== 'all') {
            filteredItems = filteredItems.filter(item => item.category === filter.category);
        }
    }

    // Update stats
    updateStats(inventory);

    // Display items
    if (filteredItems.length === 0) {
        inventoryList.innerHTML = `
            <div class="empty-state">
                <p>No items found.</p>
                ${inventory.length > 0 ? '<p>Try adjusting your filters.</p>' : '<p>Add items manually or from a receipt to get started!</p>'}
            </div>
        `;
        return;
    }

    // Sort by expiry date (soonest first)
    filteredItems.sort((a, b) => {
        const expiryA = calculateExpiryDate(a);
        const expiryB = calculateExpiryDate(b);
        return expiryA - expiryB;
    });

    inventoryList.innerHTML = filteredItems.map(item => createFoodItemHTML(item)).join('');

    // Add event listeners
    filteredItems.forEach(item => {
        // Mark as opened button
        const openBtn = document.getElementById(`open-${item.id}`);
        if (openBtn) {
            openBtn.addEventListener('click', () => markAsOpened(item.id));
        }

        // Delete button
        const deleteBtn = document.getElementById(`delete-${item.id}`);
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => deleteItem(item.id));
        }
    });
}

function createFoodItemHTML(item) {
    const status = calculateStatus(item);
    const expiryDate = calculateExpiryDate(item);
    const daysLeft = calculateDaysLeft(expiryDate);
    const statusText = getStatusText(status, daysLeft);

    return `
        <div class="food-item status-${status}">
            <div class="food-item-header">
                <div class="food-item-title">
                    <h3>${escapeHtml(item.name)}</h3>
                    <span class="category-badge">${getCategoryLabel(item.category)}</span>
                </div>
                <div class="food-item-actions">
                    ${!item.isOpened ? `<button class="btn btn-secondary" id="open-${item.id}">Mark as Opened</button>` : ''}
                    <button class="btn btn-danger" id="delete-${item.id}">Delete</button>
                </div>
            </div>

            <div class="food-item-info">
                <div class="info-row">
                    <span class="info-label">Status:</span>
                    <span class="status-badge ${status}">${statusText}</span>
                </div>

                <div class="info-row">
                    <span class="info-label">Expires:</span>
                    <strong>${formatDate(expiryDate)}</strong>
                </div>

                <div class="info-row">
                    <span class="info-label">Purchased:</span>
                    <span>${formatDate(new Date(item.purchaseDate))}</span>
                </div>

                <div class="info-row">
                    <span class="info-label">Condition:</span>
                    <span class="${item.isOpened ? 'opened-badge' : 'unopened-badge'}">
                        ${item.isOpened ? '🔓 Opened' : '🔒 Unopened'}
                    </span>
                </div>

                ${item.quantity > 1 ? `
                    <div class="info-row">
                        <span class="info-label">Quantity:</span>
                        <span class="quantity-badge">×${item.quantity}</span>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// ===== CALCULATIONS =====

function calculateExpiryDate(item) {
    const purchaseDate = new Date(item.purchaseDate);

    if (item.isOpened && item.openedDate) {
        const openedDate = new Date(item.openedDate);
        return new Date(openedDate.getTime() + item.openedDays * 24 * 60 * 60 * 1000);
    } else {
        return new Date(purchaseDate.getTime() + item.unopenedDays * 24 * 60 * 60 * 1000);
    }
}

function calculateDaysLeft(expiryDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expiryDate.setHours(0, 0, 0, 0);

    const diffTime = expiryDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function calculateStatus(item) {
    const expiryDate = calculateExpiryDate(item);
    const daysLeft = calculateDaysLeft(expiryDate);

    if (daysLeft < 0) return 'expired';
    if (daysLeft <= 3) return 'warning';
    return 'fresh';
}

function getStatusText(status, daysLeft) {
    if (status === 'expired') return `Expired ${Math.abs(daysLeft)} day${Math.abs(daysLeft) !== 1 ? 's' : ''} ago`;
    if (status === 'warning') return `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`;
    return `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`;
}

// ===== ITEM ACTIONS =====

function markAsOpened(itemId) {
    const inventory = getInventory();
    const item = inventory.find(i => i.id === itemId);

    if (item) {
        item.isOpened = true;
        item.openedDate = new Date().toISOString().split('T')[0];
        saveInventory(inventory);
        renderInventory();
        showNotification(`✓ ${item.name} marked as opened`, 'success');
    }
}

function deleteItem(itemId) {
    if (!confirm('Are you sure you want to delete this item?')) return;

    const inventory = getInventory();
    const itemIndex = inventory.findIndex(i => i.id === itemId);

    if (itemIndex !== -1) {
        const itemName = inventory[itemIndex].name;
        inventory.splice(itemIndex, 1);
        saveInventory(inventory);
        renderInventory();
        showNotification(`✓ ${itemName} removed from inventory`, 'success');
    }
}

// ===== FILTERS =====

function setupFilters() {
    const searchInput = document.getElementById('search');
    const statusFilter = document.getElementById('filter-status');
    const categoryFilter = document.getElementById('filter-category');

    const applyFilters = () => {
        renderInventory({
            search: searchInput.value.trim(),
            status: statusFilter.value,
            category: categoryFilter.value
        });
    };

    searchInput.addEventListener('input', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    categoryFilter.addEventListener('change', applyFilters);
}

// ===== STATS =====

function updateStats(inventory) {
    let freshCount = 0;
    let warningCount = 0;
    let expiredCount = 0;

    inventory.forEach(item => {
        const status = calculateStatus(item);
        if (status === 'fresh') freshCount++;
        else if (status === 'warning') warningCount++;
        else if (status === 'expired') expiredCount++;
    });

    document.getElementById('fresh-count').textContent = freshCount;
    document.getElementById('warning-count').textContent = warningCount;
    document.getElementById('expired-count').textContent = expiredCount;
}

// ===== UTILITIES =====

function switchToInventoryTab() {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    document.querySelector('[data-tab="inventory"]').classList.add('active');
    document.getElementById('inventory-tab').classList.add('active');

    renderInventory();
}

function getCategoryLabel(category) {
    const labels = {
        'dairy': 'Dairy',
        'produce': 'Produce',
        'meat': 'Meat & Seafood',
        'pantry': 'Pantry',
        'frozen': 'Frozen',
        'beverages': 'Beverages',
        'other': 'Other'
    };
    return labels[category] || category;
}

function formatDate(date) {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
    `;
    notification.textContent = message;

    // Add animation keyframes if not already added
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
