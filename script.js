// Food Inventory Tracker - Main JavaScript with OCR Support

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    initializeForms();
    initializeFileUpload();
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

    // Receipt file upload form
    document.getElementById('receipt-form').addEventListener('submit', (e) => {
        e.preventDefault();
        processReceiptFile();
    });

    // Manual receipt text button
    const manualReceiptBtn = document.getElementById('manual-receipt-btn');
    if (manualReceiptBtn) {
        manualReceiptBtn.addEventListener('click', addFromReceiptText);
    }
}

function setDefaultDates() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('purchase-date').value = today;
}

// ===== FILE UPLOAD =====

function initializeFileUpload() {
    const fileInput = document.getElementById('receipt-file');
    const uploadArea = document.getElementById('file-upload-area');
    const preview = document.getElementById('file-preview');
    const placeholder = uploadArea.querySelector('.file-upload-placeholder');

    // File input change
    fileInput.addEventListener('change', (e) => {
        handleFileSelect(e.target.files[0]);
    });

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        placeholder.style.borderColor = 'var(--primary-color)';
        placeholder.style.background = '#f0f8f0';
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        placeholder.style.borderColor = 'var(--border-color)';
        placeholder.style.background = 'var(--bg-light)';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        placeholder.style.borderColor = 'var(--border-color)';
        placeholder.style.background = 'var(--bg-light)';

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            handleFileSelect(files[0]);
        }
    });
}

function handleFileSelect(file) {
    if (!file) return;

    const preview = document.getElementById('file-preview');
    const placeholder = document.querySelector('.file-upload-placeholder');
    const previewImage = document.getElementById('preview-image');
    const previewFilename = document.getElementById('preview-filename');

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        showNotification('File too large. Maximum size is 10MB.', 'error');
        return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
        showNotification('Invalid file type. Please upload JPG, PNG, or PDF.', 'error');
        return;
    }

    // Show preview
    placeholder.style.display = 'none';
    preview.style.display = 'block';
    previewFilename.textContent = file.name;

    // Show image preview for images
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.src = e.target.result;
            previewImage.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        // For PDFs, show a PDF icon or message
        previewImage.style.display = 'none';
    }
}

// ===== OCR PROCESSING =====

async function processReceiptFile() {
    const fileInput = document.getElementById('receipt-file');
    const file = fileInput.files[0];

    if (!file) {
        showNotification('Please select a receipt image or PDF', 'error');
        return;
    }

    const processingStatus = document.getElementById('processing-status');
    const processingMessage = document.getElementById('processing-message');
    const submitBtn = document.getElementById('scan-receipt-btn');

    // Show processing status
    processingStatus.style.display = 'flex';
    submitBtn.disabled = true;

    try {
        let text = '';

        if (file.type === 'application/pdf') {
            processingMessage.textContent = 'Processing PDF...';
            text = await extractTextFromPDF(file);
        } else {
            processingMessage.textContent = 'Scanning receipt...';
            text = await extractTextFromImage(file);
        }

        processingMessage.textContent = 'Extracting items...';

        // Parse receipt text to extract items
        const items = parseReceiptText(text);

        if (items.length === 0) {
            showNotification('No food items found in receipt. Try manual entry.', 'error');
            processingStatus.style.display = 'none';
            submitBtn.disabled = false;
            return;
        }

        // Extract date from receipt or use manual input
        let purchaseDate = document.getElementById('receipt-date').value;
        if (!purchaseDate) {
            const extractedDate = extractDateFromReceipt(text);
            purchaseDate = extractedDate || new Date().toISOString().split('T')[0];
        }

        processingMessage.textContent = `Adding ${items.length} items...`;

        // Add items to inventory
        const inventory = getInventory();
        items.forEach(itemName => {
            const foodData = findFoodData(itemName);
            const item = {
                id: generateId(),
                name: itemName,
                category: foodData.category,
                purchaseDate: purchaseDate,
                unopenedDays: foodData.unopened,
                openedDays: foodData.opened,
                quantity: 1,
                isOpened: false,
                openedDate: null,
                addedAt: new Date().toISOString()
            };
            inventory.push(item);
        });

        saveInventory(inventory);

        // Success!
        processingStatus.style.display = 'none';
        submitBtn.disabled = false;
        showNotification(`✓ ${items.length} items added from receipt!`, 'success');

        // Reset form
        document.getElementById('receipt-form').reset();
        document.getElementById('file-preview').style.display = 'none';
        document.querySelector('.file-upload-placeholder').style.display = 'block';

        // Switch to inventory
        switchToInventoryTab();

    } catch (error) {
        console.error('Error processing receipt:', error);
        showNotification('Error processing receipt. Please try manual entry.', 'error');
        processingStatus.style.display = 'none';
        submitBtn.disabled = false;
    }
}

async function extractTextFromImage(file) {
    const { createWorker } = Tesseract;
    const worker = await createWorker('eng');

    const result = await worker.recognize(file);
    await worker.terminate();

    return result.data.text;
}

async function extractTextFromPDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';

    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
    }

    // If PDF has no text (scanned), convert to image and OCR
    if (fullText.trim().length < 50) {
        // Get first page as image
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const context = canvas.getContext('2d');
        await page.render({
            canvasContext: context,
            viewport: viewport
        }).promise;

        // Convert canvas to blob and OCR
        const blob = await new Promise(resolve => canvas.toBlob(resolve));
        fullText = await extractTextFromImage(blob);
    }

    return fullText;
}

function parseReceiptText(text) {
    const items = [];
    const lines = text.split('\n');

    // Common grocery patterns
    const foodKeywords = [
        'milk', 'bread', 'egg', 'cheese', 'butter', 'yogurt', 'cream',
        'chicken', 'beef', 'pork', 'fish', 'salmon', 'turkey', 'bacon',
        'apple', 'banana', 'orange', 'grape', 'berr', 'lettuce', 'tomato',
        'carrot', 'onion', 'potato', 'pepper', 'broccoli', 'spinach',
        'rice', 'pasta', 'cereal', 'flour', 'sugar', 'oil', 'sauce',
        'juice', 'soda', 'water', 'coffee', 'tea'
    ];

    // Skip patterns (non-food items)
    const skipPatterns = [
        /total/i, /subtotal/i, /tax/i, /payment/i, /cash/i, /card/i,
        /change/i, /balance/i, /thank/i, /receipt/i, /store/i,
        /date/i, /time/i, /clerk/i, /register/i, /^[\d\s\$\.]+$/,
        /discount/i, /coupon/i, /savings/i
    ];

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.length < 3) continue;

        // Skip if matches skip patterns
        if (skipPatterns.some(pattern => pattern.test(trimmed))) continue;

        // Check if line contains food keywords
        const lowerLine = trimmed.toLowerCase();
        const hasFood = foodKeywords.some(keyword => lowerLine.includes(keyword));

        if (hasFood) {
            // Clean up the line (remove prices, quantities, etc.)
            let itemName = trimmed
                .replace(/\$?[\d,]+\.?\d*/g, '')  // Remove prices
                .replace(/\d+\s*(oz|lb|g|kg|ml|l)/gi, '')  // Remove quantities
                .replace(/[^\w\s]/g, ' ')  // Remove special chars
                .replace(/\s+/g, ' ')  // Normalize spaces
                .trim();

            if (itemName.length > 2) {
                items.push(itemName);
            }
        }
    }

    // Remove duplicates
    return [...new Set(items)];
}

function extractDateFromReceipt(text) {
    // Common date patterns
    const datePatterns = [
        /(\d{1,2})[-\/](\d{1,2})[-\/](\d{2,4})/,  // MM-DD-YYYY or DD-MM-YYYY
        /(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})/,    // YYYY-MM-DD
    ];

    for (const pattern of datePatterns) {
        const match = text.match(pattern);
        if (match) {
            try {
                // Try to parse and validate the date
                const dateStr = match[0];
                const date = new Date(dateStr);
                if (!isNaN(date.getTime())) {
                    return date.toISOString().split('T')[0];
                }
            } catch (e) {
                continue;
            }
        }
    }

    return null;
}

// ===== ADD ITEMS =====

function addManualItem() {
    const name = document.getElementById('food-name').value.trim();
    let category = document.getElementById('category').value;
    const purchaseDate = document.getElementById('purchase-date').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const isOpened = document.getElementById('is-opened').checked;

    // Look up food data automatically
    const foodData = findFoodData(name);

    // If user selected a category, use it; otherwise use the looked up category
    if (category === 'other' || !category) {
        category = foodData.category;
    }

    const item = {
        id: generateId(),
        name,
        category,
        purchaseDate,
        unopenedDays: foodData.unopened,
        openedDays: foodData.opened,
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

    // Show success message with shelf life info
    showNotification(`✓ ${name} added! (${foodData.unopened} days unopened, ${foodData.opened} days opened)`, 'success');

    // Switch to inventory tab
    switchToInventoryTab();
}

function addFromReceiptText() {
    const receiptText = document.getElementById('receipt-text').value.trim();
    let purchaseDate = document.getElementById('receipt-date').value;

    if (!receiptText) {
        showNotification('Please enter at least one item', 'error');
        return;
    }

    // Use today's date if not specified
    if (!purchaseDate) {
        purchaseDate = new Date().toISOString().split('T')[0];
    }

    const lines = receiptText.split('\n').filter(line => line.trim());
    const inventory = getInventory();
    let addedCount = 0;

    lines.forEach(line => {
        const itemName = line.trim();
        if (!itemName) return;

        // Look up food data automatically
        const foodData = findFoodData(itemName);

        const item = {
            id: generateId(),
            name: itemName,
            category: foodData.category,
            purchaseDate,
            unopenedDays: foodData.unopened,
            openedDays: foodData.opened,
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
    document.getElementById('receipt-text').value = '';

    // Show success message
    showNotification(`✓ ${addedCount} items added to inventory!`, 'success');

    // Switch to inventory tab
    switchToInventoryTab();
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
                ${inventory.length > 0 ? '<p>Try adjusting your filters.</p>' : '<p>Add items manually or scan a receipt to get started!</p>'}
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
        font-size: 0.95rem;
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

    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}
