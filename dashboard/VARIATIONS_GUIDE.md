# How to Manage Product Variations in Dashboard

## Overview
The dashboard now supports full CRUD operations for product variations directly from the Products page!

## Features
✅ View all variations for a product  
✅ Add new variations with color, size, material  
✅ Set individual pricing adjustments  
✅ Manage stock per variation  
✅ Add images to variations  
✅ Delete variations  
✅ Auto-generated SKUs  

---

## Step-by-Step Guide

### 1. Access Variation Management

From the Products page:
1. Look at the **"Variations"** column
2. Each product shows its variation count
3. Click **"Manage"** button (if has variations) or **"Add"** button (if none)

![Variation button location]

### 2. Add a New Variation

In the Variations modal:
1. Click **"➕ Add Variation"** button (top right)
2. A form will appear with these fields:

**Basic Attributes:**
- **Color**: e.g., Red, Blue, Black, White
- **Size**: e.g., Small, Medium, Large, XL
- **Material** (optional): e.g., Cotton, Polyester

**Pricing:**
- **Price Adjustment**: Amount to add/subtract from base price
  - Examples:
    - `0.00` = same as base price
    - `2.00` = $2 more than base
    - `-1.00` = $1 less than base

**Stock:**
- **Stock Quantity**: Number of units available for this variation

**Images:**
- **Image URL**: URL to variation-specific image (optional)

3. Click **"Save Variation"**

### 3. View Variations

The variations table shows:
- **SKU**: Auto-generated unique identifier
- **Color**: Variation color
- **Size**: Variation size  
- **Material**: Material type
- **Price Adj.**: Price adjustment amount
- **Final Price**: Calculated final price (base + adjustment)
- **Stock**: Available quantity
- **Actions**: Delete button

### 4. Delete a Variation

1. Find the variation in the table
2. Click **"Delete"** button
3. Confirm the deletion

The variation count will update automatically.

### 5. Close Variations Modal

Click the **X** button or click outside the modal.

The products table will refresh showing updated variation counts.

---

## Example Workflow

### Scenario: Add T-Shirt Variations

**Product**: Premium Cotton T-Shirt  
**Base Price**: $29.99

**Variations to Add:**

1. **Red - Small**
   - Color: `Red`
   - Size: `Small`
   - Price Adj: `0.00`
   - Stock: `20`
   - Final Price: **$29.99**

2. **Red - Medium**
   - Color: `Red`
   - Size: `Medium`
   - Price Adj: `0.00`
   - Stock: `30`
   - Final Price: **$29.99**

3. **Red - Large**
   - Color: `Red`
   - Size: `Large`
   - Price Adj: `2.00`
   - Stock: `25`
   - Final Price: **$31.99** ✨

4. **Blue - Medium**
   - Color: `Blue`
   - Size: `Medium`
   - Material: `Cotton`
   - Price Adj: `0.00`
   - Stock: `40`
   - Image: `https://example.com/blue-tshirt.jpg`
   - Final Price: **$29.99**

---

## Tips

💡 **At least one attribute**: Add at least color, size, or material to differentiate variations

💡 **Price adjustments**: Use for size upgrades (L/XL = +$2) or premium materials

💡 **Stock tracking**: Each variation has independent stock - perfect for inventory management

💡 **Images**: Add variation-specific images to show actual color/style

💡 **Batch creation**: Create multiple similar variations by repeating the form

---

## API Integration

Variations are automatically:
- ✅ Included in public product API responses
- ✅ Used in order creation (customers can select specific variations)
- ✅ Tracked in inventory (stock reduces per variation)
- ✅ Shown in order details with variation info

---

## Troubleshooting

**Can't add variation?**
- Make sure you have at least one product created first
- Check that backend is running

**Variation not showing?**
- Refresh the page
- Close and reopen the variations modal

**Price not calculating?**
- Price adjustment is added to the product's base price
- Negative adjustments are allowed (discounts)

---

## Next Steps

After adding variations:
- View them in the Products list (count updates)
- Test ordering through Postman (include variation ID)
- Check stock levels after orders
- View variation details in order management

Enjoy your complete variation management system! 🎉
