// Comprehensive Food Shelf Life Database
// All durations are in days
// Sources: USDA FoodKeeper, FDA guidelines, food safety experts

const FOOD_DATABASE = {
    // DAIRY & EGGS
    'milk': { category: 'dairy', unopened: 7, opened: 5, storage: 'refrigerator' },
    'whole milk': { category: 'dairy', unopened: 7, opened: 5, storage: 'refrigerator' },
    'skim milk': { category: 'dairy', unopened: 7, opened: 5, storage: 'refrigerator' },
    '2% milk': { category: 'dairy', unopened: 7, opened: 5, storage: 'refrigerator' },
    'almond milk': { category: 'dairy', unopened: 7, opened: 7, storage: 'refrigerator' },
    'oat milk': { category: 'dairy', unopened: 7, opened: 7, storage: 'refrigerator' },
    'soy milk': { category: 'dairy', unopened: 7, opened: 7, storage: 'refrigerator' },
    'cream': { category: 'dairy', unopened: 14, opened: 7, storage: 'refrigerator' },
    'heavy cream': { category: 'dairy', unopened: 14, opened: 7, storage: 'refrigerator' },
    'half and half': { category: 'dairy', unopened: 7, opened: 5, storage: 'refrigerator' },
    'yogurt': { category: 'dairy', unopened: 21, opened: 7, storage: 'refrigerator' },
    'greek yogurt': { category: 'dairy', unopened: 21, opened: 7, storage: 'refrigerator' },
    'cottage cheese': { category: 'dairy', unopened: 14, opened: 7, storage: 'refrigerator' },
    'sour cream': { category: 'dairy', unopened: 21, opened: 14, storage: 'refrigerator' },
    'cream cheese': { category: 'dairy', unopened: 21, opened: 14, storage: 'refrigerator' },
    'butter': { category: 'dairy', unopened: 90, opened: 30, storage: 'refrigerator' },
    'margarine': { category: 'dairy', unopened: 120, opened: 30, storage: 'refrigerator' },

    // Cheese
    'cheddar cheese': { category: 'dairy', unopened: 90, opened: 21, storage: 'refrigerator' },
    'mozzarella cheese': { category: 'dairy', unopened: 21, opened: 7, storage: 'refrigerator' },
    'parmesan cheese': { category: 'dairy', unopened: 180, opened: 60, storage: 'refrigerator' },
    'swiss cheese': { category: 'dairy', unopened: 90, opened: 21, storage: 'refrigerator' },
    'feta cheese': { category: 'dairy', unopened: 30, opened: 7, storage: 'refrigerator' },
    'goat cheese': { category: 'dairy', unopened: 21, opened: 7, storage: 'refrigerator' },
    'blue cheese': { category: 'dairy', unopened: 30, opened: 14, storage: 'refrigerator' },
    'american cheese': { category: 'dairy', unopened: 60, opened: 21, storage: 'refrigerator' },
    'string cheese': { category: 'dairy', unopened: 14, opened: 7, storage: 'refrigerator' },
    'cheese': { category: 'dairy', unopened: 60, opened: 21, storage: 'refrigerator' },

    // Eggs
    'eggs': { category: 'dairy', unopened: 35, opened: 35, storage: 'refrigerator' },
    'egg whites': { category: 'dairy', unopened: 10, opened: 4, storage: 'refrigerator' },

    // PRODUCE - FRUITS
    'apples': { category: 'produce', unopened: 30, opened: 30, storage: 'refrigerator' },
    'bananas': { category: 'produce', unopened: 5, opened: 5, storage: 'counter' },
    'oranges': { category: 'produce', unopened: 14, opened: 14, storage: 'refrigerator' },
    'grapes': { category: 'produce', unopened: 7, opened: 7, storage: 'refrigerator' },
    'strawberries': { category: 'produce', unopened: 5, opened: 5, storage: 'refrigerator' },
    'blueberries': { category: 'produce', unopened: 10, opened: 10, storage: 'refrigerator' },
    'raspberries': { category: 'produce', unopened: 3, opened: 3, storage: 'refrigerator' },
    'blackberries': { category: 'produce', unopened: 5, opened: 5, storage: 'refrigerator' },
    'cherries': { category: 'produce', unopened: 7, opened: 7, storage: 'refrigerator' },
    'watermelon': { category: 'produce', unopened: 14, opened: 5, storage: 'refrigerator' },
    'cantaloupe': { category: 'produce', unopened: 7, opened: 3, storage: 'refrigerator' },
    'honeydew': { category: 'produce', unopened: 7, opened: 3, storage: 'refrigerator' },
    'pineapple': { category: 'produce', unopened: 5, opened: 3, storage: 'refrigerator' },
    'mango': { category: 'produce', unopened: 7, opened: 5, storage: 'refrigerator' },
    'peaches': { category: 'produce', unopened: 5, opened: 5, storage: 'refrigerator' },
    'pears': { category: 'produce', unopened: 7, opened: 7, storage: 'refrigerator' },
    'plums': { category: 'produce', unopened: 5, opened: 5, storage: 'refrigerator' },
    'kiwi': { category: 'produce', unopened: 14, opened: 14, storage: 'refrigerator' },
    'lemons': { category: 'produce', unopened: 21, opened: 21, storage: 'refrigerator' },
    'limes': { category: 'produce', unopened: 21, opened: 21, storage: 'refrigerator' },
    'grapefruit': { category: 'produce', unopened: 14, opened: 14, storage: 'refrigerator' },
    'red grapefruit': { category: 'produce', unopened: 14, opened: 14, storage: 'refrigerator' },
    'avocado': { category: 'produce', unopened: 5, opened: 2, storage: 'refrigerator' },
    'hass avocado': { category: 'produce', unopened: 5, opened: 2, storage: 'refrigerator' },
    'avocados': { category: 'produce', unopened: 5, opened: 2, storage: 'refrigerator' },

    // PRODUCE - VEGETABLES
    'lettuce': { category: 'produce', unopened: 7, opened: 5, storage: 'refrigerator' },
    'romaine lettuce': { category: 'produce', unopened: 7, opened: 5, storage: 'refrigerator' },
    'spinach': { category: 'produce', unopened: 7, opened: 5, storage: 'refrigerator' },
    'kale': { category: 'produce', unopened: 7, opened: 7, storage: 'refrigerator' },
    'arugula': { category: 'produce', unopened: 5, opened: 5, storage: 'refrigerator' },
    'mixed greens': { category: 'produce', unopened: 5, opened: 5, storage: 'refrigerator' },
    'salad mix': { category: 'produce', unopened: 7, opened: 5, storage: 'refrigerator' },
    'spring mix': { category: 'produce', unopened: 7, opened: 5, storage: 'refrigerator' },
    'cabbage': { category: 'produce', unopened: 14, opened: 10, storage: 'refrigerator' },
    'kimchi': { category: 'pantry', unopened: 180, opened: 90, storage: 'refrigerator' },
    'sauerkraut': { category: 'pantry', unopened: 120, opened: 60, storage: 'refrigerator' },
    'broccoli': { category: 'produce', unopened: 7, opened: 7, storage: 'refrigerator' },
    'cauliflower': { category: 'produce', unopened: 7, opened: 7, storage: 'refrigerator' },
    'carrots': { category: 'produce', unopened: 21, opened: 21, storage: 'refrigerator' },
    'celery': { category: 'produce', unopened: 14, opened: 14, storage: 'refrigerator' },
    'cucumbers': { category: 'produce', unopened: 7, opened: 5, storage: 'refrigerator' },
    'cucumber': { category: 'produce', unopened: 7, opened: 5, storage: 'refrigerator' },
    'tomatoes': { category: 'produce', unopened: 7, opened: 7, storage: 'counter' },
    'cherry tomatoes': { category: 'produce', unopened: 7, opened: 7, storage: 'refrigerator' },
    'bell peppers': { category: 'produce', unopened: 7, opened: 7, storage: 'refrigerator' },
    'peppers': { category: 'produce', unopened: 7, opened: 7, storage: 'refrigerator' },
    'green peppers': { category: 'produce', unopened: 7, opened: 7, storage: 'refrigerator' },
    'red peppers': { category: 'produce', unopened: 7, opened: 7, storage: 'refrigerator' },
    'jalapeños': { category: 'produce', unopened: 7, opened: 7, storage: 'refrigerator' },
    'onions': { category: 'produce', unopened: 30, opened: 7, storage: 'pantry' },
    'red onions': { category: 'produce', unopened: 30, opened: 7, storage: 'pantry' },
    'yellow onions': { category: 'produce', unopened: 30, opened: 7, storage: 'pantry' },
    'white onions': { category: 'produce', unopened: 30, opened: 7, storage: 'pantry' },
    'green onions': { category: 'produce', unopened: 7, opened: 7, storage: 'refrigerator' },
    'scallions': { category: 'produce', unopened: 7, opened: 7, storage: 'refrigerator' },
    'garlic': { category: 'produce', unopened: 90, opened: 21, storage: 'pantry' },
    'ginger': { category: 'produce', unopened: 21, opened: 14, storage: 'refrigerator' },
    'potatoes': { category: 'produce', unopened: 60, opened: 60, storage: 'pantry' },
    'sweet potatoes': { category: 'produce', unopened: 30, opened: 30, storage: 'pantry' },
    'mushrooms': { category: 'produce', unopened: 7, opened: 7, storage: 'refrigerator' },
    'zucchini': { category: 'produce', unopened: 7, opened: 7, storage: 'refrigerator' },
    'squash': { category: 'produce', unopened: 7, opened: 7, storage: 'refrigerator' },
    'butternut squash': { category: 'produce', unopened: 30, opened: 7, storage: 'counter' },
    'acorn squash': { category: 'produce', unopened: 30, opened: 7, storage: 'counter' },
    'eggplant': { category: 'produce', unopened: 7, opened: 7, storage: 'refrigerator' },
    'asparagus': { category: 'produce', unopened: 5, opened: 5, storage: 'refrigerator' },
    'green beans': { category: 'produce', unopened: 7, opened: 7, storage: 'refrigerator' },
    'corn': { category: 'produce', unopened: 3, opened: 3, storage: 'refrigerator' },
    'peas': { category: 'produce', unopened: 5, opened: 5, storage: 'refrigerator' },

    // MEAT & SEAFOOD
    'chicken breast': { category: 'meat', unopened: 2, opened: 1, storage: 'refrigerator' },
    'chicken thighs': { category: 'meat', unopened: 2, opened: 1, storage: 'refrigerator' },
    'chicken': { category: 'meat', unopened: 2, opened: 1, storage: 'refrigerator' },
    'ground chicken': { category: 'meat', unopened: 2, opened: 1, storage: 'refrigerator' },
    'turkey': { category: 'meat', unopened: 2, opened: 1, storage: 'refrigerator' },
    'ground turkey': { category: 'meat', unopened: 2, opened: 1, storage: 'refrigerator' },
    'beef': { category: 'meat', unopened: 3, opened: 2, storage: 'refrigerator' },
    'ground beef': { category: 'meat', unopened: 2, opened: 1, storage: 'refrigerator' },
    'steak': { category: 'meat', unopened: 3, opened: 2, storage: 'refrigerator' },
    'pork': { category: 'meat', unopened: 3, opened: 2, storage: 'refrigerator' },
    'pork chops': { category: 'meat', unopened: 3, opened: 2, storage: 'refrigerator' },
    'bacon': { category: 'meat', unopened: 14, opened: 7, storage: 'refrigerator' },
    'sausage': { category: 'meat', unopened: 7, opened: 3, storage: 'refrigerator' },
    'hot dogs': { category: 'meat', unopened: 14, opened: 7, storage: 'refrigerator' },
    'deli meat': { category: 'meat', unopened: 5, opened: 3, storage: 'refrigerator' },
    'ham': { category: 'meat', unopened: 5, opened: 3, storage: 'refrigerator' },
    'salami': { category: 'meat', unopened: 21, opened: 14, storage: 'refrigerator' },

    // Seafood
    'salmon': { category: 'meat', unopened: 2, opened: 1, storage: 'refrigerator' },
    'tuna': { category: 'meat', unopened: 2, opened: 1, storage: 'refrigerator' },
    'shrimp': { category: 'meat', unopened: 2, opened: 1, storage: 'refrigerator' },
    'fish': { category: 'meat', unopened: 2, opened: 1, storage: 'refrigerator' },
    'cod': { category: 'meat', unopened: 2, opened: 1, storage: 'refrigerator' },
    'tilapia': { category: 'meat', unopened: 2, opened: 1, storage: 'refrigerator' },

    // BREAD & BAKERY
    'bread': { category: 'pantry', unopened: 7, opened: 5, storage: 'pantry' },
    'white bread': { category: 'pantry', unopened: 7, opened: 5, storage: 'pantry' },
    'wheat bread': { category: 'pantry', unopened: 7, opened: 5, storage: 'pantry' },
    'sourdough bread': { category: 'pantry', unopened: 7, opened: 5, storage: 'pantry' },
    'bagels': { category: 'pantry', unopened: 7, opened: 5, storage: 'pantry' },
    'english muffins': { category: 'pantry', unopened: 14, opened: 7, storage: 'pantry' },
    'tortillas': { category: 'pantry', unopened: 30, opened: 14, storage: 'refrigerator' },
    'pita bread': { category: 'pantry', unopened: 7, opened: 5, storage: 'pantry' },
    'croissants': { category: 'pantry', unopened: 3, opened: 2, storage: 'pantry' },
    'muffins': { category: 'pantry', unopened: 7, opened: 5, storage: 'pantry' },
    'donuts': { category: 'pantry', unopened: 3, opened: 2, storage: 'pantry' },

    // PANTRY - GRAINS & PASTA
    'rice': { category: 'pantry', unopened: 730, opened: 365, storage: 'pantry' },
    'white rice': { category: 'pantry', unopened: 730, opened: 365, storage: 'pantry' },
    'brown rice': { category: 'pantry', unopened: 180, opened: 90, storage: 'pantry' },
    'pasta': { category: 'pantry', unopened: 730, opened: 365, storage: 'pantry' },
    'spaghetti': { category: 'pantry', unopened: 730, opened: 365, storage: 'pantry' },
    'noodles': { category: 'pantry', unopened: 730, opened: 365, storage: 'pantry' },
    'quinoa': { category: 'pantry', unopened: 730, opened: 180, storage: 'pantry' },
    'oats': { category: 'pantry', unopened: 365, opened: 180, storage: 'pantry' },
    'oatmeal': { category: 'pantry', unopened: 365, opened: 180, storage: 'pantry' },
    'cereal': { category: 'pantry', unopened: 365, opened: 90, storage: 'pantry' },
    'granola': { category: 'pantry', unopened: 180, opened: 90, storage: 'pantry' },
    'flour': { category: 'pantry', unopened: 365, opened: 180, storage: 'pantry' },
    'all purpose flour': { category: 'pantry', unopened: 365, opened: 180, storage: 'pantry' },
    'sugar': { category: 'pantry', unopened: 730, opened: 730, storage: 'pantry' },
    'brown sugar': { category: 'pantry', unopened: 730, opened: 180, storage: 'pantry' },

    // PANTRY - CANNED & JARRED
    'canned beans': { category: 'pantry', unopened: 730, opened: 4, storage: 'pantry' },
    'black beans': { category: 'pantry', unopened: 730, opened: 4, storage: 'pantry' },
    'kidney beans': { category: 'pantry', unopened: 730, opened: 4, storage: 'pantry' },
    'chickpeas': { category: 'pantry', unopened: 730, opened: 4, storage: 'pantry' },
    'canned tomatoes': { category: 'pantry', unopened: 730, opened: 5, storage: 'pantry' },
    'tomato sauce': { category: 'pantry', unopened: 730, opened: 5, storage: 'refrigerator' },
    'tomato paste': { category: 'pantry', unopened: 730, opened: 7, storage: 'refrigerator' },
    'pasta sauce': { category: 'pantry', unopened: 365, opened: 5, storage: 'refrigerator' },
    'salsa': { category: 'pantry', unopened: 365, opened: 30, storage: 'refrigerator' },
    'peanut butter': { category: 'pantry', unopened: 365, opened: 90, storage: 'pantry' },
    'almond butter': { category: 'pantry', unopened: 365, opened: 90, storage: 'pantry' },
    'jelly': { category: 'pantry', unopened: 365, opened: 180, storage: 'refrigerator' },
    'jam': { category: 'pantry', unopened: 365, opened: 180, storage: 'refrigerator' },
    'honey': { category: 'pantry', unopened: 1825, opened: 1825, storage: 'pantry' },
    'maple syrup': { category: 'pantry', unopened: 365, opened: 365, storage: 'refrigerator' },
    'ketchup': { category: 'pantry', unopened: 365, opened: 180, storage: 'refrigerator' },
    'mustard': { category: 'pantry', unopened: 730, opened: 365, storage: 'refrigerator' },
    'mayonnaise': { category: 'pantry', unopened: 180, opened: 60, storage: 'refrigerator' },
    'soy sauce': { category: 'pantry', unopened: 730, opened: 730, storage: 'pantry' },
    'hot sauce': { category: 'pantry', unopened: 1825, opened: 365, storage: 'pantry' },
    'olive oil': { category: 'pantry', unopened: 730, opened: 180, storage: 'pantry' },
    'vegetable oil': { category: 'pantry', unopened: 730, opened: 180, storage: 'pantry' },
    'vinegar': { category: 'pantry', unopened: 730, opened: 730, storage: 'pantry' },
    'balsamic vinegar': { category: 'pantry', unopened: 1095, opened: 1095, storage: 'pantry' },

    // PANTRY - SNACKS
    'chips': { category: 'pantry', unopened: 90, opened: 14, storage: 'pantry' },
    'crackers': { category: 'pantry', unopened: 180, opened: 30, storage: 'pantry' },
    'cookies': { category: 'pantry', unopened: 60, opened: 21, storage: 'pantry' },
    'pretzels': { category: 'pantry', unopened: 90, opened: 21, storage: 'pantry' },
    'popcorn': { category: 'pantry', unopened: 365, opened: 60, storage: 'pantry' },
    'nuts': { category: 'pantry', unopened: 180, opened: 90, storage: 'pantry' },
    'almonds': { category: 'pantry', unopened: 180, opened: 90, storage: 'pantry' },
    'cashews': { category: 'pantry', unopened: 180, opened: 90, storage: 'pantry' },
    'peanuts': { category: 'pantry', unopened: 180, opened: 90, storage: 'pantry' },
    'walnuts': { category: 'pantry', unopened: 180, opened: 90, storage: 'pantry' },

    // FROZEN
    'frozen vegetables': { category: 'frozen', unopened: 365, opened: 180, storage: 'freezer' },
    'frozen fruit': { category: 'frozen', unopened: 365, opened: 180, storage: 'freezer' },
    'frozen pizza': { category: 'frozen', unopened: 365, opened: 30, storage: 'freezer' },
    'ice cream': { category: 'frozen', unopened: 60, opened: 30, storage: 'freezer' },
    'frozen meals': { category: 'frozen', unopened: 180, opened: 7, storage: 'freezer' },
    'frozen chicken': { category: 'frozen', unopened: 365, opened: 30, storage: 'freezer' },
    'frozen fish': { category: 'frozen', unopened: 180, opened: 30, storage: 'freezer' },

    // BEVERAGES
    'orange juice': { category: 'beverages', unopened: 14, opened: 7, storage: 'refrigerator' },
    'apple juice': { category: 'beverages', unopened: 14, opened: 7, storage: 'refrigerator' },
    'juice': { category: 'beverages', unopened: 14, opened: 7, storage: 'refrigerator' },
    'soda': { category: 'beverages', unopened: 270, opened: 3, storage: 'pantry' },
    'water': { category: 'beverages', unopened: 365, opened: 365, storage: 'pantry' },
    'sparkling water': { category: 'beverages', unopened: 365, opened: 2, storage: 'pantry' },
    'coffee': { category: 'beverages', unopened: 365, opened: 90, storage: 'pantry' },
    'tea': { category: 'beverages', unopened: 730, opened: 365, storage: 'pantry' },
    'beer': { category: 'beverages', unopened: 180, opened: 1, storage: 'refrigerator' },
    'wine': { category: 'beverages', unopened: 730, opened: 5, storage: 'refrigerator' },
};

// Search keywords to help match variations
const SEARCH_KEYWORDS = {
    'milk': ['milk', '2%', 'whole', 'skim', 'lowfat', 'fat free'],
    'cheese': ['cheese', 'cheddar', 'mozzarella', 'swiss', 'american', 'provolone'],
    'yogurt': ['yogurt', 'greek', 'yoplait', 'chobani'],
    'chicken': ['chicken', 'chkn', 'chick', 'poultry'],
    'beef': ['beef', 'steak', 'ground beef', 'hamburger'],
    'bread': ['bread', 'loaf', 'baguette'],
    'lettuce': ['lettuce', 'salad', 'greens', 'romaine', 'iceberg'],
    'tomatoes': ['tomato', 'tomatoes'],
    'berries': ['berries', 'berry'],
};

// Function to find food item in database with fuzzy matching
function findFoodData(foodName) {
    if (!foodName) return null;

    const nameLower = foodName.toLowerCase().trim();

    // Direct match
    if (FOOD_DATABASE[nameLower]) {
        return FOOD_DATABASE[nameLower];
    }

    // Try to find partial matches
    for (const [key, data] of Object.entries(FOOD_DATABASE)) {
        // Check if the food name contains the database key
        if (nameLower.includes(key)) {
            return data;
        }

        // Check if the database key contains the food name (for longer database entries)
        if (key.includes(nameLower)) {
            return data;
        }
    }

    // Try keyword matching
    for (const [category, keywords] of Object.entries(SEARCH_KEYWORDS)) {
        for (const keyword of keywords) {
            if (nameLower.includes(keyword)) {
                if (FOOD_DATABASE[category]) {
                    return FOOD_DATABASE[category];
                }
            }
        }
    }

    // Default if no match found
    return {
        category: 'other',
        unopened: 7,
        opened: 5,
        storage: 'refrigerator'
    };
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FOOD_DATABASE, findFoodData };
}
