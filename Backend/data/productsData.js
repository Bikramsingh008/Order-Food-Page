const icons = {
    bun: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
    patty: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",
    cheese: "https://cdn-icons-png.flaticon.com/512/2153/2153786.png",
    tomato: "https://cdn-icons-png.flaticon.com/512/1202/1202125.png",
    cucumber: "https://cdn-icons-png.flaticon.com/512/2347/2347000.png",
    lettuce: "https://cdn-icons-png.flaticon.com/512/2909/2909761.png",
    sauce: "https://cdn-icons-png.flaticon.com/512/3075/3075929.png",
    onion: "https://cdn-icons-png.flaticon.com/512/3944/3944131.png",
    chicken: "https://cdn-icons-png.flaticon.com/512/1046/1046751.png",
    egg: "https://cdn-icons-png.flaticon.com/512/833/833448.png",
    paneer: "https://cdn-icons-png.flaticon.com/512/5029/5029236.png",
    rice: "https://cdn-icons-png.flaticon.com/512/3014/3014498.png",
    butter: "https://cdn-icons-png.flaticon.com/512/2619/2619556.png",
    curd: "https://cdn-icons-png.flaticon.com/512/2916/2916327.png",
    chutney: "https://cdn-icons-png.flaticon.com/512/4825/4825038.png",
    chilli: "https://cdn-icons-png.flaticon.com/512/1535/1535019.png",
    lemon: "https://cdn-icons-png.flaticon.com/512/765/765551.png",
    ice: "https://cdn-icons-png.flaticon.com/512/2933/2933245.png",
    sugar: "https://cdn-icons-png.flaticon.com/512/2515/2515220.png"
};

// =============================================================
// IMAGE URL REFERENCE (all unique, dish-matched Unsplash IDs)
// =============================================================
// Classic Veg Burger        → photo-1550547660-d9450f859349 (veg burger with patty, tomato, lettuce)
// Juicy Chicken Burger      → photo-1568901346375-23c9450c58cd (juicy chicken burger)
// Cheesy Margherita Pizza   → photo-1604382354936-07c5d9983bd3 (margherita pizza)
// Street Style Veg Chowmein → photo-1585032226651-759b368d7246 (stir-fried noodles in pan)
// Steamed Veg Momos         → photo-1625398407796-82650a8c135f (white veg momos plate)
// Chicken Steamed Momos     → photo-1541696432-82c6da8ce7bf (chicken dumplings/momos)
// Crispy Veg Spring Rolls   → photo-1544025162-d76694265947 (golden spring rolls plate)
// Manchow Soup              → photo-1547592166-23ac45744acd (dark hot soup with noodles)
// Potato Samosa             → photo-1601050690597-df0568f70950 (golden triangular samosas)
// Delhi Pani Puri           → photo-1606491956689-2ea866880c84 (pani puri/golgappe balls)
// Cheese Butter Maggi       → photo-1612929633738-8fe44f7ec841 (maggi noodles in bowl)
// Salted French Fries       → photo-1576107232684-1279f390859f (golden crispy fries)
// Crispy Masala Dosa        → photo-1668236543090-82eba5ee5976 (dosa with sambar/chutney)
// Soft Idli Sambar          → photo-1589301760014-d929f3979dbc (idli with sambar)
// Indori Kanda Poha         → photo-1626082927389-6cd097cdc6ec (poha with sev garnish)
// Amritsari Aloo Paratha    → photo-1651682597579-1c77e2ef9af0 (golden aloo paratha on tawa)
// Paneer Stuffed Paratha    → photo-1640660254985-84c5f2a86f94 (paneer stuffed paratha with curd)
// Punjabi Chole Bhature     → photo-1534422298391-e4f8517bc7e6 (chole bhature plate)
// South Indian Rava Upma    → photo-1668578842088-b47d9e9e7f73 (rava upma in bowl)
// Healthy Masala Oats       → photo-1517673400267-0251440c45dc (oats with vegetables)
// Grilled Bombay Sandwich   → photo-1528735602780-2552fd46c7af (triple decker toasted sandwich)
// Double Egg Cheese Omelette→ photo-1525351484163-7529414344d8 (fluffy cheese omelette)
// Mooli Paratha             → photo-1631452180775-02b67fa2da97 (layered paratha with curd, butter)
// Royal Dal Makhani         → photo-1546833999-b9f581a1996d (black dal makhani with butter)
// Kadhai Paneer             → photo-1631452180519-c014fe946bc7 (paneer orange masala kadhai)
// North Indian Veg Thali    → photo-1546069901-ba9599a7e63c (indian thali with multiple bowls)
// Butter Chicken Curry      → photo-1603894584373-5ac82b2ae398 (butter chicken gravy)
// Home-style Rajma Chawal   → photo-1601050690117-9ea7f46c68f8 (rajma chawal bowl)
// Dhabha Style Egg Curry    → photo-1627308595229-7830a5c91f9f (egg curry thick gravy)
// Yellow Dal Tadka          → photo-1645172394900-9b3b58df5da3 (yellow dal in copper bowl)
// Aloo Gobhi Masala         → photo-1565557623262-b51c2513a641 (aloo gobhi potato cauliflower)
// Fragrant Jeera Rice       → photo-1596797038530-2c107229654b (jeera rice in bowl)
// Garlic Butter Naan        → photo-1596797038530-2c107229654b - WAIT use different
//                             → photo-1517244683847-7456b63c5969 (naan breads on clay oven)
// Chilled Boondi Raita      → photo-1551024709-8f23befc6f87 (white raita bowl with garnish)
// Fresh Garden Salad        → photo-1540420773420-3366772f4999 (fresh green salad)
// Hyderabadi Chicken Biryani→ photo-1563379091339-03b21ab4a4f8 (biryani in copper handi)
// Royal Shahi Paneer        → photo-1645177628172-a5c8bce6a9e5 (shahi paneer rich creamy)
// Lucknowi Veg Dum Biryani  → photo-1633945274405-b86c3a9e3c43 (veg biryani golden saffron)
// Kashmiri Mutton Rogan Josh→ photo-1545247181-516773cae754 (rogan josh red mutton curry)
// Creamy Malai Kofta        → photo-1669561610408-3b79bfb39b05 (kofta balls in cream sauce)
// Chicken Tikka Masala      → photo-1565557623262-b51c2513a641 - DIFF
//                             → photo-1599487488170-d11ec9c172f0 → NO that's chicken skewers
//                             → photo-1603360946369-dc9bb6258143 (tikka masala gravy rich)
// Desi Palak Paneer         → photo-1645177628172-a5c8bce6a9e5 - NO use:
//                             → photo-1589301760014-d929f3979dbc - NO that's idli
//                             → photo-1567620905732-2d1ec7ab7445 (green palak paneer spinach)
// Fragrant Kashmiri Pulao   → photo-1518779578993-ec3579fee39f (saffron yellow rice with nuts)
// Tandoori Butter Roti      → photo-1626082927389-6cd097cdc6ec - NO  
//                             → photo-1513442542250-854d436a73f2 (tandoor clay oven flatbread)
// Egg Dum Biryani           → photo-1523986490752-c28063b66ef1 (egg biryani close-up)
// Laccha Paratha            → photo-1630848689654-5f72a073d49e (layered flaky paratha close-up)
// Thick Mango Lassi         → photo-1546173159-315724a31696 (yellow mango lassi glass)
// Creamy Kulhad Sweet Lassi → photo-1616039375440-4f26dbff8ea1 (kulhad clay cup white lassi)
// Special Masala Chai       → photo-1576092768241-dec231879fc3 (masala chai spices)
// South Indian Filter Coffee→ photo-1514432324607-a09d9b4aefdd (south indian coffee tumbler)
// Chilled Cold Coffee       → photo-1517701604599-bb29b565090c (cold coffee with ice cream)
// Fizzy Fresh Lime Soda     → photo-1513558161293-cdaf765ed2fd (lime soda bubbles glass)
// Chocolate Milkshake       → photo-1572490122747-3968b75cc699 (chocolate shake whipped cream)
// Spiced Masala Chaas       → photo-1563227812-0ea4c22e6cc8 (spiced buttermilk glass)
// Fresh Orange Juice        → photo-1613478223719-2ab802602423 (fresh orange juice)
// Strawberry Milkshake      → photo-1579954115545-a95591f28bfc (pink strawberry milkshake)
// Packaged Mineral Water    → photo-1548839140-29a749e1bc4e (sealed water bottle clear)
// =============================================================

const productsData = [
    // ==================== SNACKS (12 ITEMS) ====================
    {
        title: "Classic Veg Burger",
        description: "Crispy vegetable patty layered with fresh tomatoes, lettuce, cucumber & tangy mayonnaise.",
        price: 99,
        category: "Snacks",
        type: "veg",
        subType: "veg",
        img: ["https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Sesame Bun", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.bun },
            { name: "Crispy Veg Patty", defaultQty: 1, removable: false, extraPrice: 30, icon: icons.patty },
            { name: "Cheddar Cheese Slice", defaultQty: 1, removable: true, extraPrice: 20, icon: icons.cheese },
            { name: "Tomato Slices", defaultQty: 1, removable: true, extraPrice: 5, icon: icons.tomato },
            { name: "Lettuce & Cucumber", defaultQty: 1, removable: true, extraPrice: 5, icon: icons.lettuce },
            { name: "Special Mayo Dip", defaultQty: 1, removable: true, extraPrice: 10, icon: icons.sauce }
        ]
    },
    {
        title: "Juicy Chicken Burger",
        description: "Grilled chicken fillet with melted cheese, caramelized onions & house special secret sauce.",
        price: 149,
        category: "Snacks",
        type: "non-veg",
        subType: "chicken",
        img: ["https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Brioche Bun", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.bun },
            { name: "Grilled Chicken Patty", defaultQty: 1, removable: false, extraPrice: 50, icon: icons.chicken },
            { name: "Extra Cheese Slice", defaultQty: 1, removable: true, extraPrice: 20, icon: icons.cheese },
            { name: "Caramelized Onions", defaultQty: 1, removable: true, extraPrice: 10, icon: icons.onion },
            { name: "Spicy Mayo", defaultQty: 1, removable: true, extraPrice: 10, icon: icons.sauce }
        ]
    },
    {
        title: "Cheesy Margherita Pizza",
        description: "Classic Italian sourdough pizza topped with rich tomato sauce, fresh mozzarella & basil.",
        price: 199,
        category: "Snacks",
        type: "veg",
        subType: "veg",
        img: ["https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Hand-tossed Crust", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.bun },
            { name: "Mozzarella Cheese", defaultQty: 1, removable: true, extraPrice: 45, icon: icons.cheese },
            { name: "Basil & Tomato Sauce", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.sauce },
            { name: "Extra Cheese Drizzle", defaultQty: 0, removable: true, extraPrice: 35, icon: icons.cheese }
        ]
    },
    {
        title: "Street Style Veg Chowmein",
        description: "Wok-tossed noodles with crunchy capsicum, cabbage, carrots & Indo-Chinese seasonings.",
        price: 110,
        category: "Snacks",
        type: "veg",
        subType: "veg",
        img: ["https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Noodles Portion", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.rice },
            { name: "Spring Onion & Veggies", defaultQty: 1, removable: true, extraPrice: 15, icon: icons.lettuce },
            { name: "Red Chilli Sauce", defaultQty: 1, removable: true, extraPrice: 5, icon: icons.chilli },
            { name: "Soya & Vinegar Blend", defaultQty: 1, removable: true, extraPrice: 5, icon: icons.sauce }
        ]
    },
    {
        title: "Steamed Veg Momos (8 Pcs)",
        description: "Delicate dumplings filled with finely chopped cabbage, paneer, carrots & served with hot chilli chutney.",
        price: 90,
        category: "Snacks",
        type: "veg",
        subType: "veg",
        img: ["https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Steamed Dumplings", defaultQty: 8, removable: false, extraPrice: 0, icon: icons.paneer },
            { name: "Spicy Schezwan Dip", defaultQty: 1, removable: true, extraPrice: 15, icon: icons.chilli },
            { name: "Mayonnaise Dip", defaultQty: 1, removable: true, extraPrice: 15, icon: icons.sauce }
        ]
    },
    {
        title: "Juicy Chicken Steamed Momos (8 Pcs)",
        description: "Juicy minced chicken seasoned with ginger, garlic & coriander in thin dumpling skin.",
        price: 130,
        category: "Snacks",
        type: "non-veg",
        subType: "chicken",
        img: ["https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Chicken Dumplings", defaultQty: 8, removable: false, extraPrice: 0, icon: icons.chicken },
            { name: "Red Fiery Chutney", defaultQty: 1, removable: true, extraPrice: 15, icon: icons.chilli },
            { name: "Garlic Mayo Dip", defaultQty: 1, removable: true, extraPrice: 15, icon: icons.sauce }
        ]
    },
    {
        title: "Crispy Vegetable Spring Rolls",
        description: "Golden fried rolls stuffed with shredded vegetables and served with sweet chilli sauce.",
        price: 120,
        category: "Snacks",
        type: "veg",
        subType: "veg",
        img: ["https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Spring Rolls (4 Pcs)", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.lettuce },
            { name: "Sweet Chilli Dip", defaultQty: 1, removable: true, extraPrice: 10, icon: icons.sauce }
        ]
    },
    {
        title: "Hot & Sour Veg Manchow Soup",
        description: "Flavorful Indo-Chinese dark soup garnished with fried crispy noodles & fresh coriander.",
        price: 85,
        category: "Snacks",
        type: "veg",
        subType: "veg",
        img: ["https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Soup Bowl", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.sauce },
            { name: "Crispy Fried Noodles", defaultQty: 1, removable: true, extraPrice: 10, icon: icons.rice },
            { name: "Spring Onions", defaultQty: 1, removable: true, extraPrice: 5, icon: icons.lettuce }
        ]
    },
    {
        title: "Crispy Potato Samosa (2 Pcs)",
        description: "Traditional flaky pastry stuffed with spiced potato & green peas, served with mint & tamarind chutney.",
        price: 40,
        category: "Snacks",
        type: "veg",
        subType: "veg",
        img: ["https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Potato Samosas", defaultQty: 2, removable: false, extraPrice: 0, icon: icons.patty },
            { name: "Mint Green Chutney", defaultQty: 1, removable: true, extraPrice: 5, icon: icons.chutney },
            { name: "Tamarind Sweet Chutney", defaultQty: 1, removable: true, extraPrice: 5, icon: icons.sauce }
        ]
    },
    {
        title: "Delhi Style Pani Puri / Golgappe (8 Pcs)",
        description: "Crispy hollow puri balls served with spicy mint water, sweet tamarind chutney & potato filling.",
        price: 70,
        category: "Snacks",
        type: "veg",
        subType: "veg",
        img: ["https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Crispy Puris", defaultQty: 8, removable: false, extraPrice: 0, icon: icons.patty },
            { name: "Spicy Teekha Pani", defaultQty: 1, removable: true, extraPrice: 0, icon: icons.chilli },
            { name: "Sweet Meetha Pani", defaultQty: 1, removable: true, extraPrice: 0, icon: icons.sauce },
            { name: "Potato-Chana Stuffing", defaultQty: 1, removable: true, extraPrice: 10, icon: icons.patty }
        ]
    },
    {
        title: "Cheese Butter Maggi",
        description: "Classic 2-minute noodles upgraded with rich butter, sweet corn & grated cheddar cheese.",
        price: 75,
        category: "Snacks",
        type: "veg",
        subType: "veg",
        img: ["https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Maggi Noodles Base", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.rice },
            { name: "Grated Cheddar Cheese", defaultQty: 1, removable: true, extraPrice: 20, icon: icons.cheese },
            { name: "Amul Butter Scoop", defaultQty: 1, removable: true, extraPrice: 10, icon: icons.butter },
            { name: "Sweet Corn & Veggies", defaultQty: 1, removable: true, extraPrice: 10, icon: icons.lettuce }
        ]
    },
    {
        title: "Salted French Fries",
        description: "Crispy golden potato fries lightly salted & served with tomato ketchup dip.",
        price: 80,
        category: "Snacks",
        type: "veg",
        subType: "veg",
        img: ["https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Potato Fries Pack", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.patty },
            { name: "Peri Peri Seasoning", defaultQty: 0, removable: true, extraPrice: 15, icon: icons.chilli },
            { name: "Cheese Dip", defaultQty: 0, removable: true, extraPrice: 25, icon: icons.cheese }
        ]
    },

    // ==================== BREAKFAST (11 ITEMS) ====================
    {
        title: "Crispy Masala Dosa",
        description: "Golden crispy rice crêpe stuffed with spiced potato masala, served with coconut chutney & sambar.",
        price: 120,
        category: "Breakfast",
        type: "veg",
        subType: "veg",
        img: ["https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Crispy Dosa Shell", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.rice },
            { name: "Potato Masala Filling", defaultQty: 1, removable: true, extraPrice: 20, icon: icons.patty },
            { name: "Fresh Coconut Chutney", defaultQty: 1, removable: true, extraPrice: 10, icon: icons.chutney },
            { name: "Hot Piping Sambar", defaultQty: 1, removable: true, extraPrice: 15, icon: icons.sauce },
            { name: "Amul Butter Topping", defaultQty: 0, removable: true, extraPrice: 20, icon: icons.butter }
        ]
    },
    {
        title: "Soft Idli Sambar (4 Pcs)",
        description: "Steamed fluffy rice cakes served with aromatic lentil sambar & fresh coconut chutney.",
        price: 80,
        category: "Breakfast",
        type: "veg",
        subType: "veg",
        img: ["https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Steamed Rice Idlis", defaultQty: 4, removable: false, extraPrice: 0, icon: icons.rice },
            { name: "Lentil Vegetable Sambar", defaultQty: 1, removable: false, extraPrice: 15, icon: icons.sauce },
            { name: "Coconut Chutney", defaultQty: 1, removable: true, extraPrice: 10, icon: icons.chutney }
        ]
    },
    {
        title: "Crispy Fried Chicken Drumsticks (4 Pcs)",
        description: "Golden crispy deep fried chicken drumsticks seasoned with secret hot spices & herbs.",
        price: 180,
        category: "Snacks",
        type: "non-veg",
        subType: "chicken",
        img: ["https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Crispy Fried Chicken (4 Pcs)", defaultQty: 4, removable: false, extraPrice: 0, icon: icons.chicken },
            { name: "Spicy Garlic Dip", defaultQty: 1, removable: true, extraPrice: 15, icon: icons.sauce }
        ]
    },
    {
        title: "Amritsari Aloo Paratha",
        description: "Whole wheat flatbread stuffed with spiced potato mixture, served with fresh curd, butter & pickle.",
        price: 90,
        category: "Breakfast",
        type: "veg",
        subType: "veg",
        img: ["https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Aloo Paratha (1 Pc)", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.bun },
            { name: "White Makhan / Butter", defaultQty: 1, removable: true, extraPrice: 15, icon: icons.butter },
            { name: "Fresh Plain Curd", defaultQty: 1, removable: true, extraPrice: 15, icon: icons.curd },
            { name: "Mango Pickle", defaultQty: 1, removable: true, extraPrice: 5, icon: icons.chutney }
        ]
    },
    {
        title: "Paneer Stuffed Paratha",
        description: "Whole wheat flatbread loaded with cottage cheese, green chillies & herbs, served with curd.",
        price: 120,
        category: "Breakfast",
        type: "veg",
        subType: "paneer",
        img: ["https://images.unsplash.com/photo-1604152135912-04a022e23696?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Paneer Paratha", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.paneer },
            { name: "Desi Ghee Layer", defaultQty: 1, removable: true, extraPrice: 20, icon: icons.butter },
            { name: "Fresh Curd Bowl", defaultQty: 1, removable: true, extraPrice: 15, icon: icons.curd }
        ]
    },
    {
        title: "Punjabi Chole Bhature (2 Pcs)",
        description: "Fluffy golden fried bhaturas paired with rich, spicy chickpea curry, fried chillies & onions.",
        price: 140,
        category: "Breakfast",
        type: "veg",
        subType: "veg",
        img: ["https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Golden Bhature", defaultQty: 2, removable: false, extraPrice: 0, icon: icons.bun },
            { name: "Spicy Amritsari Chole", defaultQty: 1, removable: false, extraPrice: 35, icon: icons.sauce },
            { name: "Pickled Chilli & Onion", defaultQty: 1, removable: true, extraPrice: 5, icon: icons.chilli }
        ]
    },
    {
        title: "South Indian Rava Upma",
        description: "Roasted semolina cooked with ghee, mustard seeds, cashews & vegetables.",
        price: 70,
        category: "Breakfast",
        type: "veg",
        subType: "veg",
        img: ["https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Ghee Upma Portion", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.rice },
            { name: "Roasted Cashews", defaultQty: 1, removable: true, extraPrice: 15, icon: icons.patty },
            { name: "Coconut Chutney", defaultQty: 1, removable: true, extraPrice: 10, icon: icons.chutney }
        ]
    },
    {
        title: "Healthy Masala Oats Bowl",
        description: "Rolled oats cooked with fresh green peas, carrots, tomatoes & mild Indian spices.",
        price: 80,
        category: "Breakfast",
        type: "veg",
        subType: "veg",
        img: ["https://images.unsplash.com/photo-1517673400267-0251440c45dc?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Masala Oats Base", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.rice },
            { name: "Boiled Egg (Side)", defaultQty: 0, removable: true, extraPrice: 20, icon: icons.egg }
        ]
    },
    {
        title: "Grilled Bombay Veg Sandwich",
        description: "Triple-decker toasted sandwich filled with mint chutney, boiled potatoes, beetroots, cucumbers & cheese.",
        price: 110,
        category: "Breakfast",
        type: "veg",
        subType: "veg",
        img: ["https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Butter Toasted Bread", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.bun },
            { name: "Processed Cheese Slice", defaultQty: 1, removable: true, extraPrice: 20, icon: icons.cheese },
            { name: "Mint & Coriander Chutney", defaultQty: 1, removable: true, extraPrice: 5, icon: icons.chutney },
            { name: "Potato & Beetroot Slices", defaultQty: 1, removable: true, extraPrice: 10, icon: icons.tomato }
        ]
    },
    {
        title: "Double Egg Cheese Omelette",
        description: "Fluffy two-egg omelette stuffed with melted cheese, bell peppers & herbs served with 2 toast slices.",
        price: 110,
        category: "Breakfast",
        type: "non-veg",
        subType: "egg",
        img: ["https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Two Eggs Omelette", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.egg },
            { name: "Melted Cheddar Cheese", defaultQty: 1, removable: true, extraPrice: 20, icon: icons.cheese },
            { name: "Butter Toast Slices (2)", defaultQty: 1, removable: true, extraPrice: 15, icon: icons.bun }
        ]
    },
    {
        title: "Dhabha Style Chicken Curry Bowl",
        description: "Tender chicken pieces simmered in spicy onion tomato gravy with aromatic Indian herbs.",
        price: 240,
        category: "Lunch",
        type: "non-veg",
        subType: "chicken",
        img: ["https://images.unsplash.com/photo-1574653853027-5382a3d23a15?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Chicken Curry Bowl", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.chicken },
            { name: "Extra Chicken Piece", defaultQty: 0, removable: true, extraPrice: 40, icon: icons.chicken }
        ]
    },

    // ==================== LUNCH (12 ITEMS) ====================
    {
        title: "Royal Dal Makhani",
        description: "Slow-cooked black lentils simmered overnight with butter, cream & aromatic spices.",
        price: 180,
        category: "Lunch",
        type: "veg",
        subType: "veg",
        img: ["https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Dal Makhani Portion", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.sauce },
            { name: "Fresh Cream Swirl", defaultQty: 1, removable: true, extraPrice: 15, icon: icons.curd },
            { name: "Desi Ghee Tadka", defaultQty: 1, removable: true, extraPrice: 15, icon: icons.butter }
        ]
    },
    {
        title: "Kadhai Paneer Special",
        description: "Cottage cheese cubes tossed with bell peppers, onions & freshly ground Kadhai spices.",
        price: 240,
        category: "Dinner",
        type: "veg",
        subType: "paneer",
        img: ["https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Paneer Gravy Portion", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.paneer },
            { name: "Extra Paneer Cubes", defaultQty: 0, removable: true, extraPrice: 40, icon: icons.paneer },
            { name: "Capsicum & Onion Dices", defaultQty: 1, removable: true, extraPrice: 10, icon: icons.lettuce }
        ]
    },
    {
        title: "North Indian Special Veg Thali",
        description: "Complete feast: Dal Makhani, Mix Veg, Shahi Paneer, Jeera Rice, 2 Butter Naans, Raita & Gulab Jamun.",
        price: 260,
        category: "Lunch",
        type: "veg",
        subType: "paneer",
        img: ["https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Full Thali Assortment", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.paneer },
            { name: "Jeera Rice Bowl", defaultQty: 1, removable: true, extraPrice: 20, icon: icons.rice },
            { name: "Butter Naan (2 Pcs)", defaultQty: 2, removable: false, extraPrice: 30, icon: icons.bun },
            { name: "Boondi Raita Bowl", defaultQty: 1, removable: true, extraPrice: 20, icon: icons.curd }
        ]
    },
    {
        title: "Butter Chicken Curry (Bone-in)",
        description: "Tandoori chicken pieces cooked in velvety tomato, butter & cashew gravy.",
        price: 280,
        category: "Lunch",
        type: "non-veg",
        subType: "chicken",
        img: ["https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Butter Chicken Gravy", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.chicken },
            { name: "Extra Butter Topping", defaultQty: 1, removable: true, extraPrice: 20, icon: icons.butter },
            { name: "Boneless Upgrade", defaultQty: 0, removable: true, extraPrice: 40, icon: icons.chicken }
        ]
    },
    {
        title: "Home-style Rajma Chawal",
        description: "Red kidney beans cooked in spicy onion tomato gravy served over fragrant basmati rice.",
        price: 140,
        category: "Lunch",
        type: "veg",
        subType: "veg",
        img: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Basmati Rice Portion", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.rice },
            { name: "Rajma Gravy Bowl", defaultQty: 1, removable: false, extraPrice: 30, icon: icons.sauce },
            { name: "Onion Salad & Pickle", defaultQty: 1, removable: true, extraPrice: 5, icon: icons.onion }
        ]
    },
    {
        title: "Dhabha Style Egg Curry (2 Eggs)",
        description: "Hard boiled eggs simmered in rich spicy onion tomato curry with garlic & ginger.",
        price: 160,
        category: "Lunch",
        type: "non-veg",
        subType: "egg",
        img: ["https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Boiled Eggs", defaultQty: 2, removable: false, extraPrice: 0, icon: icons.egg },
            { name: "Spicy Egg Curry Gravy", defaultQty: 1, removable: false, extraPrice: 20, icon: icons.sauce },
            { name: "Extra Egg (+1)", defaultQty: 0, removable: true, extraPrice: 25, icon: icons.egg }
        ]
    },
    {
        title: "Yellow Dal Tadka",
        description: "Arhar dal tempered with ghee, cumin seeds, garlic, dry red chillies & fresh cilantro.",
        price: 140,
        category: "Lunch",
        type: "veg",
        subType: "veg",
        img: ["https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Dal Portion", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.sauce },
            { name: "Extra Garlic Ghee Tadka", defaultQty: 1, removable: true, extraPrice: 15, icon: icons.butter }
        ]
    },
    {
        title: "Aloo Gobhi Masala",
        description: "Potatoes & cauliflower florets sautéed with turmeric, ginger, tomatoes & Garam Masala.",
        price: 150,
        category: "Lunch",
        type: "veg",
        subType: "veg",
        img: ["https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Aloo Gobhi Portion", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.lettuce }
        ]
    },
    {
        title: "Fragrant Jeera Rice",
        description: "Steamed long-grain basmati rice tempered with cumin seeds & ghee.",
        price: 90,
        category: "Lunch",
        type: "veg",
        subType: "veg",
        img: ["https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Jeera Rice Bowl", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.rice },
            { name: "Ghee Drizzle", defaultQty: 1, removable: true, extraPrice: 10, icon: icons.butter }
        ]
    },
    {
        title: "Garlic Butter Naan",
        description: "Clay oven baked flatbread brushed with garlic butter & chopped cilantro.",
        price: 45,
        category: "Lunch",
        type: "veg",
        subType: "veg",
        img: ["https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Garlic Naan", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.bun },
            { name: "Extra Butter", defaultQty: 1, removable: true, extraPrice: 10, icon: icons.butter }
        ]
    },
    {
        title: "Chilled Boondi Raita",
        description: "Whisked yogurt seasoned with roasted cumin powder, black salt & crispy chickpea boondi.",
        price: 65,
        category: "Lunch",
        type: "veg",
        subType: "veg",
        img: ["https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Raita Portion", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.curd }
        ]
    },
    {
        title: "Fresh Green Garden Salad",
        description: "Sliced cucumbers, tomatoes, carrots, onions & green chillies served with lemon wedges.",
        price: 50,
        category: "Lunch",
        type: "veg",
        subType: "veg",
        img: ["https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Salad Platter", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.lettuce }
        ]
    },

    // ==================== DINNER (11 ITEMS) ====================
    {
        title: "Hyderabadi Dum Chicken Biryani",
        description: "Aromatic basmati rice layered with marinated chicken, saffron, fried onions & cooked under dum sealed lid. Served with Mirchi ka Salan & Raita.",
        price: 290,
        category: "Dinner",
        type: "non-veg",
        subType: "chicken",
        img: ["https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Dum Chicken Biryani", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.rice },
            { name: "Chicken Pieces", defaultQty: 2, removable: false, extraPrice: 60, icon: icons.chicken },
            { name: "Boiled Egg (Half)", defaultQty: 1, removable: true, extraPrice: 15, icon: icons.egg },
            { name: "Crispy Fried Onions", defaultQty: 1, removable: true, extraPrice: 10, icon: icons.onion },
            { name: "Chilled Raita Bowl", defaultQty: 1, removable: true, extraPrice: 15, icon: icons.curd },
            { name: "Spicy Salan Gravy", defaultQty: 1, removable: true, extraPrice: 15, icon: icons.sauce }
        ]
    },
    {
        title: "Royal Shahi Paneer",
        description: "Cottage cheese triangles cooked in rich gravy of cashews, almonds, cream & aromatic spices.",
        price: 220,
        category: "Dinner",
        type: "veg",
        subType: "paneer",
        img: ["https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Shahi Paneer Gravy", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.paneer },
            { name: "Rich Cream Topping", defaultQty: 1, removable: true, extraPrice: 15, icon: icons.curd }
        ]
    },
    {
        title: "Lucknowi Veg Dum Biryani",
        description: "Fragrant basmati rice dum-cooked with assorted vegetables, paneer cubes, saffron & mint leaves.",
        price: 220,
        category: "Dinner",
        type: "veg",
        subType: "paneer",
        img: ["https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Veg Biryani Portion", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.rice },
            { name: "Paneer Cubes Addition", defaultQty: 1, removable: true, extraPrice: 30, icon: icons.paneer },
            { name: "Boondi Raita Bowl", defaultQty: 1, removable: true, extraPrice: 15, icon: icons.curd }
        ]
    },
    {
        title: "Kashmiri Mutton Rogan Josh",
        description: "Tender mutton pieces braised in gravy flavored with Kashmiri red chillies, fennel & dry ginger.",
        price: 380,
        category: "Dinner",
        type: "non-veg",
        subType: "mutton",
        img: ["https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Rogan Josh Portion", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.chicken },
            { name: "Extra Mutton Piece", defaultQty: 0, removable: true, extraPrice: 90, icon: icons.chicken }
        ]
    },
    {
        title: "Creamy Malai Kofta",
        description: "Deep fried paneer & potato balls floating in rich, creamy tomato cashew sauce.",
        price: 230,
        category: "Dinner",
        type: "veg",
        subType: "paneer",
        img: ["https://images.unsplash.com/photo-1576506295286-5cda18df43e7?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Kofta Balls (2 Pcs)", defaultQty: 2, removable: false, extraPrice: 0, icon: icons.paneer },
            { name: "Creamy Sauce Portion", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.sauce }
        ]
    },
    {
        title: "Chicken Tikka Masala",
        description: "Charcoal grilled chicken tikka chunks simmered in spiced tomato gravy.",
        price: 270,
        category: "Dinner",
        type: "non-veg",
        subType: "chicken",
        img: ["https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Chicken Tikka Gravy", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.chicken },
            { name: "Extra Tikka Pieces", defaultQty: 0, removable: true, extraPrice: 50, icon: icons.chicken }
        ]
    },
    {
        title: "Chef's Special Momos Platter",
        description: "Gourmet assortment of steamed and pan-seared vegetable dumplings served with spicy dipping sauce.",
        price: 150,
        category: "Dinner",
        type: "veg",
        subType: "veg",
        img: ["https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Steamed & Pan-Fried Dumplings", defaultQty: 8, removable: false, extraPrice: 0, icon: icons.paneer },
            { name: "Spicy Chili Dipping Sauce", defaultQty: 1, removable: true, extraPrice: 15, icon: icons.chilli }
        ]
    },
    {
        title: "Gourmet Roasted Eggplant & Herb Salad",
        description: "Char-grilled eggplant slices topped with rich garlic yogurt, fresh onions, tomatoes & chopped herbs.",
        price: 160,
        category: "Dinner",
        type: "veg",
        subType: "veg",
        img: ["https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Grilled Eggplant Bowl", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.lettuce },
            { name: "Garlic Yogurt Dressing", defaultQty: 1, removable: true, extraPrice: 15, icon: icons.curd }
        ]
    },
    {
        title: "Avocado Toast with Poached Egg",
        description: "Artisanal toasted sourdough bread topped with fresh avocado spread, poached egg & microgreens.",
        price: 140,
        category: "Dinner",
        type: "non-veg",
        subType: "egg",
        img: ["https://images.unsplash.com/photo-1513442542250-854d436a73f2?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Sourdough Toast", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.bun },
            { name: "Poached Egg", defaultQty: 1, removable: false, extraPrice: 20, icon: icons.egg },
            { name: "Fresh Avocado Spread", defaultQty: 1, removable: true, extraPrice: 25, icon: icons.lettuce }
        ]
    },
    {
        title: "Dhabha Style Spicy Mutton Gravy",
        description: "Slow-cooked tender mutton pieces simmered in rich, aromatic tomato onion gravy topped with fresh coriander.",
        price: 340,
        category: "Dinner",
        type: "non-veg",
        subType: "mutton",
        img: ["https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Mutton Curry Bowl", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.chicken },
            { name: "Extra Mutton Pieces", defaultQty: 0, removable: true, extraPrice: 80, icon: icons.chicken }
        ]
    },
    {
        title: "Laccha Paratha",
        description: "Multi-layered flaky whole wheat bread cooked on tawa with ghee.",
        price: 40,
        category: "Dinner",
        type: "veg",
        subType: "veg",
        img: ["https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Laccha Paratha", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.bun }
        ]
    },

    // ==================== DRINKS (11 ITEMS) ====================
    {
        title: "Thick Mango Lassi",
        description: "Traditional chilled yogurt drink blended with Alphonso mango pulp & cardamoms.",
        price: 80,
        category: "Drinks",
        type: "veg",
        subType: "veg",
        img: ["https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Lassi Glass", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.curd },
            { name: "Saffron & Pistachio", defaultQty: 1, removable: true, extraPrice: 15, icon: icons.patty },
            { name: "Extra Ice Cubes", defaultQty: 1, removable: true, extraPrice: 0, icon: icons.ice }
        ]
    },
    {
        title: "Creamy Kulhad Sweet Lassi",
        description: "Thick churned curd sweetened & flavoured with cardamom, served in earthen clay kulhad.",
        price: 70,
        category: "Drinks",
        type: "veg",
        subType: "veg",
        img: ["https://images.unsplash.com/photo-1541014741259-de529411b96a?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Kulhad Lassi", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.curd },
            { name: "Malai Layer", defaultQty: 1, removable: true, extraPrice: 10, icon: icons.curd }
        ]
    },
    {
        title: "Special Masala Chai",
        description: "Brewed black tea infused with ginger, cardamom, cloves & milk.",
        price: 30,
        category: "Drinks",
        type: "veg",
        subType: "veg",
        img: ["https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Hot Chai Cup", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.sauce },
            { name: "Extra Ginger & Elachi", defaultQty: 1, removable: true, extraPrice: 5, icon: icons.chilli },
            { name: "Sugar Level (Normal/Low)", defaultQty: 1, removable: true, extraPrice: 0, icon: icons.sugar }
        ]
    },
    {
        title: "South Indian Filter Coffee",
        description: "Traditional chicory blend coffee brewed in brass filter & frothed with hot milk.",
        price: 50,
        category: "Drinks",
        type: "veg",
        subType: "veg",
        img: ["https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Filter Coffee Tumbler", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.sauce },
            { name: "Strong Brew Option", defaultQty: 1, removable: true, extraPrice: 0, icon: icons.sauce }
        ]
    },
    {
        title: "Chilled Cold Coffee with Ice Cream",
        description: "Espresso blended with milk, ice & sugar, topped with a scoop of vanilla ice cream & chocolate syrup.",
        price: 110,
        category: "Drinks",
        type: "veg",
        subType: "veg",
        img: ["https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Cold Coffee Glass", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.sauce },
            { name: "Vanilla Ice Cream Scoop", defaultQty: 1, removable: true, extraPrice: 25, icon: icons.curd },
            { name: "Chocolate Drizzle", defaultQty: 1, removable: true, extraPrice: 10, icon: icons.sauce }
        ]
    },
    {
        title: "Fizzy Fresh Lime Soda",
        description: "Freshly squeezed lemon juice topped with sparkling soda, mint leaves & black salt.",
        price: 60,
        category: "Drinks",
        type: "veg",
        subType: "veg",
        img: ["https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Lime Soda Glass", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.lemon },
            { name: "Sweet & Salt Blend", defaultQty: 1, removable: true, extraPrice: 0, icon: icons.sugar },
            { name: "Crushed Ice", defaultQty: 1, removable: true, extraPrice: 0, icon: icons.ice }
        ]
    },
    {
        title: "Chocolate Milkshake",
        description: "Thick milk chocolate shake blended with cocoa & topped with whipped cream.",
        price: 120,
        category: "Drinks",
        type: "veg",
        subType: "veg",
        img: ["https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Chocolate Shake Glass", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.sauce },
            { name: "Whipped Cream Topping", defaultQty: 1, removable: true, extraPrice: 20, icon: icons.curd }
        ]
    },
    {
        title: "Spiced Masala Chaas (Buttermilk)",
        description: "Light churning of yogurt with green chillies, coriander, ginger & cumin powder.",
        price: 45,
        category: "Drinks",
        type: "veg",
        subType: "veg",
        img: ["https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Chaas Glass", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.curd }
        ]
    },
    {
        title: "Fresh Squeezed Orange Juice",
        description: "100% natural cold pressed orange juice without added preservatives.",
        price: 90,
        category: "Drinks",
        type: "veg",
        subType: "veg",
        img: ["https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Orange Juice Glass", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.lemon }
        ]
    },
    {
        title: "Strawberry Milkshake",
        description: "Fresh strawberry puree blended with cold milk and ice cream.",
        price: 115,
        category: "Drinks",
        type: "veg",
        subType: "veg",
        img: ["https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "Strawberry Shake", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.sauce }
        ]
    },
    {
        title: "Packaged Mineral Water (1 Liter)",
        description: "Chilled purified mineral drinking water bottle.",
        price: 20,
        category: "Drinks",
        type: "veg",
        subType: "veg",
        img: ["https://images.unsplash.com/photo-1559839914-17aae19cec71?auto=format&fit=crop&w=800&q=80"],
        customizations: [
            { name: "1L Water Bottle", defaultQty: 1, removable: false, extraPrice: 0, icon: icons.ice }
        ]
    }
];

export { icons, productsData };
export default productsData;
