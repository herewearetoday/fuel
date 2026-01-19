# 🍎 Food Inventory Tracker

A simple, mobile-friendly web application to help you track your groceries and reduce food waste. Never let food expire again!

## Features

- **📝 Manual Entry**: Add food items one at a time with detailed information
- **🧾 Receipt Import**: Quickly add multiple items from your grocery receipt
- **📅 Expiration Tracking**: Automatic calculation of expiration dates
- **🔓 Opened/Unopened Status**: Track when items are opened (many foods have different shelf lives once opened)
- **🔍 Search & Filter**: Find items quickly with search and category filters
- **📊 Dashboard Stats**: See at a glance how many items are fresh, expiring soon, or expired
- **📱 Responsive Design**: Works perfectly on phones, tablets, and desktops
- **💾 Local Storage**: All data is saved in your browser (no account needed)

## How to Use

### Getting Started

1. Open `index.html` in your web browser
2. You'll see three tabs: **Add Manually**, **From Receipt**, and **My Inventory**

### Adding Items Manually

1. Go to the **Add Manually** tab
2. Fill in the food item details:
   - **Food Name**: e.g., "Cottage Cheese"
   - **Category**: Select from Dairy, Produce, Meat, Pantry, Frozen, Beverages, or Other
   - **Purchase Date**: When you bought it
   - **Unopened Shelf Life**: How many days it lasts unopened (e.g., 60 days)
   - **Opened Shelf Life**: How many days it lasts after opening (e.g., 7 days)
   - **Quantity**: How many you have (default: 1)
   - **Mark as already opened**: Check this if you've already opened the item
3. Click **Add to Inventory**

### Adding Items from Receipt

1. Go to the **From Receipt** tab
2. Enter the purchase date
3. Type or paste items, one per line, in this format:
   ```
   Item Name, Unopened Days, Opened Days
   ```
   Examples:
   ```
   Milk, 14, 7
   Eggs, 21, 14
   Bread, 7, 5
   Cottage Cheese, 60, 7
   ```

   **Tip**: If you just type the item name (e.g., `Milk`), it will use default values (30 days unopened, 7 days opened)

4. Click **Add All Items**

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

## Understanding Expiration Status

Items are color-coded based on their expiration status:

- 🟢 **Green (Fresh)**: 4+ days until expiration
- 🟡 **Yellow (Expiring Soon)**: 1-3 days until expiration
- 🔴 **Red (Expired)**: Past expiration date

## Common Shelf Life Guidelines

Here are some typical shelf lives to help you get started:

### Dairy
- **Milk**: Unopened 14 days, Opened 7 days
- **Yogurt**: Unopened 21 days, Opened 7 days
- **Cottage Cheese**: Unopened 60 days, Opened 7 days
- **Hard Cheese**: Unopened 90 days, Opened 30 days

### Produce
- **Lettuce**: 7 days
- **Berries**: 5 days
- **Apples**: 30 days
- **Carrots**: 21 days

### Meat & Seafood
- **Ground Beef**: Unopened 2 days, Cooked 3 days
- **Chicken Breast**: Unopened 2 days, Cooked 4 days
- **Fish**: Unopened 2 days, Cooked 3 days

### Pantry
- **Bread**: 7 days
- **Crackers**: Unopened 180 days, Opened 30 days
- **Cereal**: Unopened 365 days, Opened 60 days

## Tips for Best Results

1. **Be Conservative**: When in doubt, use shorter shelf lives to be safe
2. **Update Regularly**: Check your inventory daily to catch items before they expire
3. **Mark as Opened**: Always mark items as opened right away for accurate tracking
4. **Use Categories**: Organize items by category to find them faster
5. **Delete Consumed Items**: Keep your inventory up-to-date by removing items you've eaten

## Technical Details

- **No Installation Required**: Just open `index.html` in any modern web browser
- **No Internet Needed**: Works completely offline after initial load
- **No Account Required**: All data is stored locally in your browser
- **Data Persistence**: Your inventory is saved automatically and will be there when you return
- **Privacy**: Your data never leaves your device

## Browser Compatibility

Works with all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Hosting on GitHub Pages

To make this website available online:

1. Go to your repository on GitHub
2. Click **Settings** > **Pages**
3. Under "Source", select your main branch
4. Click **Save**
5. Your website will be available at: `https://yourusername.github.io/fuel/`

## Data Management

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

## Contributing

Feel free to customize this application to fit your needs! The code is organized as follows:

- `index.html` - Main structure and layout
- `style.css` - All styling and responsive design
- `script.js` - All functionality and data management

## License

Free to use and modify for personal or commercial purposes.

---

Happy tracking! 🎉 Never waste food again! 🥗
