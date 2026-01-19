// Food Inventory Tracker - Main JavaScript with OCR Support

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    initializeForms();
    initializeFileUpload();
    initializeVoiceRecognition();
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
    const purchaseDateInput = document.getElementById('purchase-date');
    if (purchaseDateInput) {
        purchaseDateInput.value = today;
    }
}

// ===== VOICE RECOGNITION =====

let recognition = null;
let isRecording = false;

function initializeVoiceRecognition() {
    const voiceBtn = document.getElementById('voice-btn');
    const voiceHelp = document.getElementById('voice-help');
    const textarea = document.getElementById('receipt-text');

    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        voiceBtn.style.display = 'none';
        return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    let finalTranscript = '';
    let interimTranscript = '';

    recognition.onstart = () => {
        isRecording = true;
        voiceBtn.classList.add('recording');
        voiceHelp.style.display = 'block';
        finalTranscript = textarea.value;
    };

    recognition.onresult = (event) => {
        interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;

            if (event.results[i].isFinal) {
                finalTranscript += (finalTranscript ? '\n' : '') + transcript.trim();
            } else {
                interimTranscript += transcript;
            }
        }

        // Show interim results in textarea
        if (interimTranscript) {
            textarea.value = finalTranscript + (finalTranscript ? '\n' : '') + interimTranscript;
        } else {
            textarea.value = finalTranscript;
        }
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        stopRecording();

        if (event.error === 'not-allowed') {
            showNotification('Microphone access denied. Please allow microphone access.', 'error');
        } else if (event.error === 'no-speech') {
            showNotification('No speech detected. Try again.', 'error');
        } else {
            showNotification('Voice recognition error. Try again.', 'error');
        }
    };

    recognition.onend = () => {
        if (isRecording) {
            // Auto-restart if still recording
            try {
                recognition.start();
            } catch (e) {
                stopRecording();
            }
        }
    };

    voiceBtn.addEventListener('click', () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    });

    function startRecording() {
        try {
            finalTranscript = textarea.value;
            recognition.start();
        } catch (e) {
            console.error('Error starting recognition:', e);
            showNotification('Could not start voice recognition', 'error');
        }
    }

    function stopRecording() {
        isRecording = false;
        voiceBtn.classList.remove('recording');
        voiceHelp.style.display = 'none';

        try {
            recognition.stop();
        } catch (e) {
            // Already stopped
        }

        // Clean up the transcript
        if (textarea.value) {
            textarea.value = cleanTranscript(textarea.value);
        }
    }

    function cleanTranscript(text) {
        // Split by newlines and also by common separators (commas, "and", pauses)
        let items = text.split(/[\n,]|(?:\s+and\s+)/i);

        // Further split by detecting multiple food words in sequence
        const expandedItems = [];
        items.forEach(item => {
            const words = item.trim().split(/\s+/);
            if (words.length > 3) {
                // If too many words, try to split into individual items
                // Common pattern: "eggs milk bread" -> ["eggs", "milk", "bread"]
                words.forEach(word => {
                    if (word.length >= 3) {
                        expandedItems.push(word);
                    }
                });
            } else {
                expandedItems.push(item.trim());
            }
        });

        return expandedItems
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => {
                // Capitalize first letter
                return line.charAt(0).toUpperCase() + line.slice(1);
            })
            .join('\n');
    }
}

// ===== FILE UPLOAD =====

function initializeFileUpload() {
    const fileInput = document.getElementById('receipt-file');
    const uploadArea = document.getElementById('file-upload-area');
    const preview = document.getElementById('file-preview');
    const placeholder = uploadArea.querySelector('.file-upload-placeholder');

    // File input change (handles multiple files)
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]); // Show preview of first file
            // Store all files for processing
            uploadArea.dataset.fileCount = e.target.files.length;
        }
    });

    // Paste support for images
    document.addEventListener('paste', (e) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (const item of items) {
            if (item.type.startsWith('image/')) {
                e.preventDefault();
                const file = item.getAsFile();
                if (file) {
                    // Set the file to the input
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    fileInput.files = dataTransfer.files;

                    handleFileSelect(file);
                    showNotification('📋 Image pasted! Click "Scan Receipt" to process.', 'success');
                }
                break;
            }
        }
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
    const files = Array.from(fileInput.files);

    if (files.length === 0) {
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
        let allText = '';
        let processedCount = 0;

        // Process each file
        for (const file of files) {
            processedCount++;
            processingMessage.textContent = `Processing receipt ${processedCount}/${files.length}...`;

            let text = '';

            if (file.type === 'application/pdf') {
                text = await extractTextFromPDF(file);
            } else {
                text = await extractTextFromImage(file);
            }

            allText += text + '\n';
        }

        const text = allText;

        processingMessage.textContent = 'Extracting items...';

        // Parse receipt text to extract items
        let items = parseReceiptText(text);

        // Apply fuzzy matching to correct OCR errors
        items = items.map(item => correctItemName(item));

        // Filter out items that couldn't be matched
        items = items.filter(item => item !== null);

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
    // Preprocess the image for better OCR results
    const preprocessedImage = await preprocessImageForOCR(file);

    const { createWorker } = Tesseract;
    const worker = await createWorker('eng');

    // Configure for better accuracy with receipts
    await worker.setParameters({
        tessedit_pageseg_mode: '6', // Assume uniform block of text
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 /-&',
    });

    const result = await worker.recognize(preprocessedImage);
    await worker.terminate();

    return result.data.text;
}

async function preprocessImageForOCR(file) {
    return new Promise((resolve) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target.result;
        };

        img.onload = () => {
            // Create canvas for preprocessing
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Scale up for better OCR (2x)
            canvas.width = img.width * 2;
            canvas.height = img.height * 2;

            // Draw image scaled up
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Get image data for processing
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Apply preprocessing: increase contrast and convert to grayscale
            for (let i = 0; i < data.length; i += 4) {
                // Convert to grayscale
                const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;

                // Increase contrast (simple threshold)
                const threshold = 128;
                const contrasted = gray > threshold ? 255 : 0;

                data[i] = contrasted;     // R
                data[i + 1] = contrasted; // G
                data[i + 2] = contrasted; // B
            }

            ctx.putImageData(imageData, 0, 0);

            // Convert canvas to blob
            canvas.toBlob((blob) => {
                resolve(blob);
            });
        };

        reader.readAsDataURL(file);
    });
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

// Levenshtein distance for fuzzy matching
function levenshteinDistance(str1, str2) {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));

    for (let i = 0; i <= len1; i++) matrix[i][0] = i;
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;

    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }

    return matrix[len1][len2];
}

// Correct OCR errors by fuzzy matching against known foods
function correctItemName(ocrText) {
    const cleanText = ocrText.toLowerCase().trim();

    // Get all food names from database
    const knownFoods = Object.keys(FOOD_DATABASE);

    // Find best match using Levenshtein distance
    let bestMatch = null;
    let bestScore = Infinity;
    const maxDistance = Math.floor(cleanText.length * 0.4); // Allow 40% error

    for (const food of knownFoods) {
        const distance = levenshteinDistance(cleanText, food);

        // Calculate similarity score (lower is better)
        const score = distance / Math.max(cleanText.length, food.length);

        if (distance <= maxDistance && distance < bestScore) {
            bestScore = distance;
            bestMatch = food;
        }

        // Also check if OCR text contains the food name
        if (cleanText.includes(food) || food.includes(cleanText.split(' ')[0])) {
            if (distance < bestScore) {
                bestScore = distance;
                bestMatch = food;
            }
        }
    }

    // If we found a reasonable match, return it
    if (bestMatch && bestScore <= maxDistance) {
        // Convert to title case
        return bestMatch.split(' ').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    // If no match found but the text looks like a food name, keep it
    if (cleanText.length >= 4 && /^[a-z\s]+$/.test(cleanText)) {
        return ocrText;
    }

    return null; // Filter out
}

function parseReceiptText(text) {
    const items = [];
    const lines = text.split('\n');

    // Patterns to skip (receipt metadata, not food items)
    const skipPatterns = [
        /^total/i, /^subtotal/i, /^tax/i, /tax paid/i, /^payment/i, /^cash/i, /^card/i,
        /^change/i, /^balance/i, /thank you/i, /^receipt/i, /^store/i,
        /^\d{1,2}\/\d{1,2}\/\d{2,4}/, /^\d{1,2}:\d{2}/, /^time:/i, /^date:/i,
        /^clerk/i, /^register/i, /^cashier/i, /discount/i, /^coupon/i, /^savings/i,
        /^visa/i, /^mastercard/i, /^amex/i, /^discover/i, /^credit/i, /^debit/i,
        /^approved/i, /^declined/i, /^invoice/i, /^transaction/i, /^auth/i,
        /^mid:/i, /^rrn:/i, /^aid:/i, /^tvr:/i, /^tsi:/i, /^entry method/i,
        /^service center/i, /^customer/i, /^phone/i, /^address/i, /^zip/i,
        /^reward/i, /^member/i, /^bag fee/i, /^bottle/i, /^can deposit/i,
        /^[\d\s\$\.\*\-_]+$/, // Only numbers, dollars, spaces, asterisks
        /^[W\s\*]+$/, /^[M\s\*]+$/, // Lines with just W or M (weight markers)
        /^\d+\s*@\s*\$/, // Quantity pricing lines like "3 @ $0.75"
        /^\$[\d\.]+\s*$/, // Lines that are just prices
        /^[\*\s]+$/ // Lines with just asterisks
    ];

    // Common non-food receipt words to remove from item names
    const cleanupWords = /\b(organic|fresh|local|premium|select|choice|grade a|pkg|pack|ea|each|ct|count)\b/gi;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line || line.length < 3) continue;

        // Skip lines that match skip patterns
        if (skipPatterns.some(pattern => pattern.test(line))) continue;

        // Skip lines that are too short or too long (likely not product names)
        if (line.length < 3 || line.length > 100) continue;

        // Skip lines that are mostly numbers
        const numCount = (line.match(/\d/g) || []).length;
        if (numCount > line.length * 0.6) continue;

        // Extract item name by removing common receipt artifacts
        let itemName = line
            // Remove prices with dollar signs
            .replace(/\$\s*[\d,]+\.?\d*/g, '')
            // Remove standalone numbers that look like prices
            .replace(/\s+[\d,]+\.?\d{2}\s*\*?\s*$/g, '')
            // Remove weight/quantity info (e.g., "0.59 lb @", "16 OZ")
            .replace(/\d+\.?\d*\s*(lb|oz|g|kg|ml|l|ct)\s*@?\s*[\d\.\$\/]+/gi, '')
            // Remove weight markers like "W" or "M"
            .replace(/\s+[WM]\s*$/gi, '')
            // Remove asterisks
            .replace(/\*/g, '')
            // Remove department codes (e.g., "HRD", "BE", "EE")
            .replace(/^(HRD|BE|EE|WRAPPD|SH-ON|an|a)\s+/gi, '')
            .replace(/\s+(HRD|BE|EE|MW|He|aut|TR)$/gi, '')
            // Remove "FOR" pricing (e.g., "2 FOR")
            .replace(/\d+\s+FOR\s+[\d\.]+/gi, '')
            // Remove quantity at start (e.g., "3 @", "2 @")
            .replace(/^\d+\s*@\s*/g, '')
            // Remove bulk/weight pricing
            .replace(/\d+\.\d{2}\/lb/gi, '')
            // Remove cleanup words
            .replace(cleanupWords, '')
            // Remove extra special characters but keep hyphens and apostrophes
            .replace(/[^\w\s\-'\/]/g, ' ')
            // Normalize spaces
            .replace(/\s+/g, ' ')
            .trim();

        // Skip if cleaning removed everything or left very little
        if (!itemName || itemName.length < 3) continue;

        // Skip if it's still just numbers or single letters
        if (/^[\d\s]+$/.test(itemName) || /^[A-Z]\s*$/.test(itemName)) continue;

        // Convert to title case for better readability
        itemName = itemName
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        // Add to items list
        items.push(itemName);
    }

    // Remove duplicates and filter out very short items
    const uniqueItems = [...new Set(items)].filter(item => item.length >= 3);

    // If we got very few items, be more lenient (might have missed some)
    if (uniqueItems.length < 5) {
        console.log('Low item count detected. Consider manual entry.');
    }

    return uniqueItems;
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

function addFromReceiptText() {
    const receiptText = document.getElementById('receipt-text').value.trim();
    let purchaseDate = document.getElementById('manual-purchase-date').value;

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

        // Mark as unopened (undo) button
        const undoBtn = document.getElementById(`undo-open-${item.id}`);
        if (undoBtn) {
            undoBtn.addEventListener('click', () => markAsUnopened(item.id));
        }

        // Edit expiry button
        const editExpiryBtn = document.getElementById(`edit-expiry-${item.id}`);
        if (editExpiryBtn) {
            editExpiryBtn.addEventListener('click', () => editExpiryDate(item.id));
        }

        // Delete button
        const deleteBtn = document.getElementById(`delete-${item.id}`);
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => deleteItem(item.id));
        }
    });
}

// Get emoji icon for food item
function getFoodEmoji(itemName, category) {
    const name = itemName.toLowerCase();

    // Specific foods
    if (name.includes('milk')) return '🥛';
    if (name.includes('cheese')) return '🧀';
    if (name.includes('yogurt')) return '🥛';
    if (name.includes('butter')) return '🧈';
    if (name.includes('egg')) return '🥚';

    if (name.includes('apple')) return '🍎';
    if (name.includes('banana')) return '🍌';
    if (name.includes('orange')) return '🍊';
    if (name.includes('grape')) return '🍇';
    if (name.includes('strawberr') || name.includes('berr')) return '🍓';
    if (name.includes('blueberr')) return '🫐';
    if (name.includes('watermelon')) return '🍉';
    if (name.includes('lemon')) return '🍋';
    if (name.includes('avocado')) return '🥑';
    if (name.includes('grapefruit')) return '🍊';

    if (name.includes('carrot')) return '🥕';
    if (name.includes('tomato')) return '🍅';
    if (name.includes('pepper')) return '🫑';
    if (name.includes('lettuce') || name.includes('salad') || name.includes('greens')) return '🥬';
    if (name.includes('broccoli')) return '🥦';
    if (name.includes('cucumber')) return '🥒';
    if (name.includes('onion')) return '🧅';
    if (name.includes('garlic')) return '🧄';
    if (name.includes('potato')) return '🥔';
    if (name.includes('mushroom')) return '🍄';
    if (name.includes('corn')) return '🌽';

    if (name.includes('chicken')) return '🍗';
    if (name.includes('beef') || name.includes('steak')) return '🥩';
    if (name.includes('bacon')) return '🥓';
    if (name.includes('shrimp')) return '🍤';
    if (name.includes('fish') || name.includes('salmon')) return '🐟';

    if (name.includes('bread')) return '🍞';
    if (name.includes('rice')) return '🍚';
    if (name.includes('pasta')) return '🍝';
    if (name.includes('pizza')) return '🍕';

    if (name.includes('juice')) return '🧃';
    if (name.includes('water')) return '💧';
    if (name.includes('coffee')) return '☕';
    if (name.includes('tea')) return '🍵';

    if (name.includes('kimchi')) return '🥬';
    if (name.includes('squash')) return '🎃';

    // Category defaults
    if (category === 'dairy') return '🥛';
    if (category === 'produce') return '🥗';
    if (category === 'meat') return '🍖';
    if (category === 'pantry') return '🥫';
    if (category === 'frozen') return '🧊';
    if (category === 'beverages') return '🥤';

    return '🍽️'; // Default
}

function createFoodItemHTML(item) {
    const status = calculateStatus(item);
    const expiryDate = calculateExpiryDate(item);
    const daysLeft = calculateDaysLeft(expiryDate);
    const statusText = getStatusText(status, daysLeft);
    const emoji = getFoodEmoji(item.name, item.category);

    return `
        <div class="food-item status-${status}">
            <div class="food-item-header">
                <div class="food-icon">${emoji}</div>
                <div class="food-item-title">
                    <h3>${escapeHtml(item.name)}</h3>
                    <span class="category-badge">${getCategoryLabel(item.category)}</span>
                </div>
                <div class="food-item-actions">
                    ${!item.isOpened && item.unopenedDays !== item.openedDays ? `<button class="btn btn-secondary" id="open-${item.id}">Mark as Opened</button>` : ''}
                    ${item.isOpened && item.unopenedDays !== item.openedDays ? `<button class="btn btn-secondary" id="undo-open-${item.id}">Mark as Unopened</button>` : ''}
                    <button class="btn btn-secondary" id="edit-expiry-${item.id}">Edit Expiry</button>
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

function markAsUnopened(itemId) {
    const inventory = getInventory();
    const item = inventory.find(i => i.id === itemId);

    if (item) {
        item.isOpened = false;
        item.openedDate = null;
        saveInventory(inventory);
        renderInventory();
        showNotification(`✓ ${item.name} marked as unopened`, 'success');
    }
}

function editExpiryDate(itemId) {
    const inventory = getInventory();
    const item = inventory.find(i => i.id === itemId);

    if (!item) return;

    // Calculate current expiry date
    const currentExpiry = calculateExpiryDate(item);
    const currentExpiryStr = currentExpiry.toISOString().split('T')[0];

    // Prompt for new expiry date
    const newExpiryStr = prompt(
        `Edit expiry date for ${item.name}\n\nCurrent expiry: ${formatDate(currentExpiry)}\n\nEnter new expiry date (YYYY-MM-DD):`,
        currentExpiryStr
    );

    if (!newExpiryStr) return; // User cancelled

    // Validate date
    const newExpiry = new Date(newExpiryStr);
    if (isNaN(newExpiry.getTime())) {
        showNotification('Invalid date format', 'error');
        return;
    }

    // Calculate new shelf life in days from purchase date
    const purchaseDate = new Date(item.purchaseDate);
    const daysDiff = Math.ceil((newExpiry - purchaseDate) / (1000 * 60 * 60 * 24));

    // Update the item's shelf life
    if (item.isOpened) {
        // If opened, update opened shelf life
        const openedDate = new Date(item.openedDate);
        const daysFromOpened = Math.ceil((newExpiry - openedDate) / (1000 * 60 * 60 * 24));
        item.openedDays = Math.max(1, daysFromOpened);
    } else {
        // If unopened, update unopened shelf life
        item.unopenedDays = Math.max(1, daysDiff);
    }

    saveInventory(inventory);
    renderInventory();
    showNotification(`✓ Expiry date updated for ${item.name}`, 'success');
}

function deleteItem(itemId) {
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
