# 🍎 Food Inventory Tracker

A smart, mobile-friendly web application that helps you track your groceries and reduce food waste. Features **automatic shelf life estimation** for 200+ common foods and **intelligent receipt scanning** with OCR technology!

## ✨ Key Features

- **🤖 Automatic Shelf Life Estimation**: Just enter the food name - the app automatically knows how long it lasts!
- **📸 Smart Receipt Scanning**: Upload a photo or PDF of your receipt and the app extracts all the items
- **📅 Expiration Tracking**: Automatic calculation of expiration dates based on food science guidelines
- **🔓 Opened/Unopened Status**: Different shelf lives for opened vs unopened items (e.g., cottage cheese: 60 days unopened, 7 days opened)
- **🔍 Search & Filter**: Find items quickly with search and category filters
- **📊 Dashboard Stats**: See at a glance how many items are fresh, expiring soon, or expired
- **📱 Responsive Design**: Works perfectly on phones, tablets, and desktops
- **💾 Local Storage**: All data is saved in your browser (no account needed)
- **🎯 Smart Food Database**: Built-in knowledge of 200+ common grocery items with USDA-based shelf lives

## 🚀 How to Use

### Getting Started

1. Open `index.html` in your web browser
2. You'll see three tabs: **Add Manually**, **From Receipt**, and **My Inventory**

### Adding Items Manually

1. Go to the **Add Manually** tab
2. Fill in the food item details:
   - **Food Name**: e.g., "Cottage Cheese" or "Blueberries"
   - **Category**: Optionally select from Dairy, Produce, Meat, Pantry, Frozen, Beverages, or Other
   - **Purchase Date**: When you bought it
   - **Quantity**: How many you have (default: 1)
   - **Mark as already opened**: Check this if you've already opened the item
3. Click **Add to Inventory**

**The app automatically estimates shelf life!** No need to look up how long each food lasts - it already knows!

### Scanning a Receipt (Recommended!)

1. Go to the **From Receipt** tab
2. Upload your receipt:
   - **Take a photo** of your receipt with your phone
   - **Upload a PDF** receipt from an online order
   - Or **drag and drop** the file into the upload area
3. Optionally enter the purchase date (the app will try to extract it from the receipt)
4. Click **Scan Receipt & Add Items**
5. The app will:
   - Extract all food items from the receipt using OCR
   - Automatically look up shelf life for each item
   - Add everything to your inventory in seconds!

### Manual Receipt Entry (Alternative)

If receipt scanning doesn't work perfectly, you can also:
1. Scroll down to "Enter Items Manually"
2. Type or paste food names (one per line):
   ```
   Milk
   Eggs
   Bread
   Blueberries
   Cottage Cheese
   ```
3. Click **Add These Items**
4. The app will automatically estimate shelf life for each item!

### Viewing Your Inventory

1. Go to the **My Inventory** tab
2. You'll see:
   - **Stats**: Number of fresh, expiring soon, and expired items
   - **Search bar**: Search for specific items
   - **Filters**: Filter by status (Fresh, Expiring Soon, Expired) or category
   - **Item cards**: Each item shows:
     - Name and category
     - Expiration status and date
     - Purchase date
     - Opened/Unopened status
     - Quantity (if more than 1)

### Managing Items

- **Mark as Opened**: Click this button when you open an unopened item. The expiration date will automatically recalculate based on the opened shelf life.
- **Delete**: Remove items from your inventory when they're consumed or discarded.

## 🍏 Understanding Automatic Shelf Life

The app has a built-in database of 200+ common grocery items with shelf lives based on **USDA FoodKeeper** and **FDA guidelines**. Here are some examples:

### Dairy
- **Milk**: 7 days unopened, 5 days opened
- **Yogurt**: 21 days unopened, 7 days opened
- **Cottage Cheese**: 14 days unopened, 7 days opened
- **Hard Cheese (Cheddar)**: 90 days unopened, 21 days opened

### Produce
- **Blueberries**: 10 days (in fridge)
- **Strawberries**: 5 days
- **Lettuce**: 7 days unopened, 5 days opened
- **Carrots**: 21 days
- **Bananas**: 5 days (counter)

### Meat & Seafood
- **Chicken Breast**: 2 days unopened, 1 day opened
- **Ground Beef**: 2 days unopened, 1 day opened
- **Salmon**: 2 days unopened, 1 day opened
- **Bacon**: 14 days unopened, 7 days opened

### Pantry
- **Bread**: 7 days unopened, 5 days opened
- **Pasta**: 730 days (2 years) unopened, 365 days opened
- **Rice**: 730 days unopened, 365 days opened
- **Peanut Butter**: 365 days unopened, 90 days opened

### Frozen
- **Frozen Vegetables**: 365 days unopened, 180 days opened
- **Ice Cream**: 60 days unopened, 30 days opened
- **Frozen Pizza**: 365 days unopened, 30 days opened

**Don't see your food?** Don't worry! The app uses smart matching:
- It recognizes variations (e.g., "whole milk", "2% milk", "skim milk")
- It matches partial names (e.g., "organic blueberries" → "blueberries")
- If it can't find an exact match, it uses safe default values (7 days unopened, 5 days opened)

## 🎨 Understanding Expiration Status

Items are color-coded based on their expiration status:

- 🟢 **Green (Fresh)**: 4+ days until expiration - all good!
- 🟡 **Yellow (Expiring Soon)**: 1-3 days until expiration - use soon!
- 🔴 **Red (Expired)**: Past expiration date - discard or compost

## 💡 Pro Tips

1. **Scan receipts immediately**: When you get home from the store, scan your receipt right away for instant tracking
2. **Take clear photos**: For best OCR results, make sure the receipt is flat and well-lit
3. **Review scanned items**: After scanning, check the inventory tab to make sure everything was captured correctly
4. **Mark items as opened**: Always mark items as opened right away for accurate expiration tracking
5. **Check daily**: Make it a habit to check your inventory daily to see what needs to be used soon
6. **Use categories**: Categories help you find items faster (auto-assigned based on food type)
7. **Mobile-friendly**: Add the website to your phone's home screen for quick access while cooking

## 🔬 Technical Details

### Technologies Used
- **HTML/CSS/JavaScript**: Pure vanilla JS, no complex frameworks
- **Tesseract.js**: OCR (Optical Character Recognition) for extracting text from images
- **PDF.js**: PDF parsing and text extraction
- **Local Storage**: Browser-based data persistence
- **Responsive CSS Grid/Flexbox**: Mobile-first responsive design

### Features
- **200+ Food Database**: Comprehensive shelf life data based on USDA FoodKeeper
- **Smart Food Matching**: Fuzzy matching algorithm to recognize food name variations
- **OCR Processing**: Extracts items and dates from receipt photos and PDFs
- **Automatic Date Extraction**: Tries to find the purchase date on the receipt
- **No Server Required**: Runs entirely in your browser, works offline
- **Privacy First**: Your data never leaves your device

## 🌐 Browser Compatibility

Works with all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

**Note**: Receipt scanning requires a modern browser that supports:
- File API
- Canvas API
- Web Workers (for OCR processing)

## 📤 Hosting on GitHub Pages

To make this website available online:

1. Go to your repository on GitHub
2. Click **Settings** > **Pages**
3. Under "Source", select your main branch
4. Click **Save**
5. Your website will be available at: `https://yourusername.github.io/fuel/`

**Tip**: Add a bookmark to your phone's home screen for quick access!

## 🛠️ Data Management

### Backing Up Your Data

Your data is stored in your browser's local storage. To back it up:
1. Open the browser console (F12)
2. Go to the Console tab
3. Type: `localStorage.getItem('foodInventory')`
4. Copy the output and save it to a text file

### Restoring Your Data

1. Open the browser console (F12)
2. Go to the Console tab
3. Type: `localStorage.setItem('foodInventory', 'YOUR_BACKUP_DATA')`
4. Refresh the page

### Clearing All Data

To start fresh:
1. Open the browser console (F12)
2. Go to the Console tab
3. Type: `localStorage.removeItem('foodInventory')`
4. Refresh the page

## 📁 Project Structure

```
fuel/
├── index.html          # Main HTML structure
├── style.css           # Responsive styling
├── script.js           # Main application logic with OCR
├── food-database.js    # 200+ food shelf life database
└── README.md           # This file
```

## 🤝 Contributing

Want to add more foods to the database? The food data is in `food-database.js`. Feel free to add more items or improve the shelf life estimates based on food safety guidelines!

## 🔒 Privacy & Security

- **100% Client-Side**: All processing happens in your browser
- **No Data Collection**: We don't collect, store, or transmit any of your data
- **Local Storage Only**: Your inventory is saved only on your device
- **No Cookies**: No tracking or analytics
- **OCR Processing**: Receipt text extraction happens entirely in your browser

## 📝 License

Free to use and modify for personal or commercial purposes.

## 🙏 Credits

- **Shelf Life Data**: Based on USDA FoodKeeper and FDA food storage guidelines
- **OCR Engine**: Tesseract.js by Naptha
- **PDF Processing**: PDF.js by Mozilla
- **Icons**: SVG icons for upload interface

---

**Happy tracking! 🎉 Never waste food again! 🥗**

*Built with ❤️ to help reduce food waste and save money*
