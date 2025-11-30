# Dashboard Troubleshooting Guide

## Issue: Can't See Variations on Dashboard

### Quick Fix Steps:

#### 1. **Refresh Your Browser**
   - Hard refresh: `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)
   - This clears the cached JavaScript file

#### 2. **Check Console for Errors**
   Open Browser Developer Tools:
   - Press `F12` or `Right-click → Inspect`
   - Go to **Console** tab
   - Look for any red errors
   - Take a screenshot if you see errors

#### 3. **Verify Backend is Running**
   ```bash
   # In terminal, make sure you see:
   Starting development server at http://127.0.0.1:8000/
   ```

#### 4. **Test the Variations Manually**
   
   **Step A - Check if variations exist:**
   ```bash
   cd /Users/mohamedghaly/Desktop/WomaBackend
   source venv/bin/activate
   python manage.py shell
   ```
   
   Then in the Python shell:
   ```python
   from products.models import ProductVariation
   print(f"Total variations: {ProductVariation.objects.count()}")
   
   # If 0, create sample data:
   exit()
   ```
   
   **Step B - Create sample data if needed:**
   ```bash
   python create_sample_variations.py
   ```

#### 5. **Test API Directly**
   
   Open a new browser tab and test these URLs:
   
   **A. Check if products have variation_count:**
   ```
   http://localhost:8000/api/v1/admin/products/
   ```
   Login with token, look for `"variation_count": 9` in response
   
   **B. Check variations API:**
   ```
   http://localhost:8000/api/v1/admin/variations/
   ```
   Should show list of variations

#### 6. **Verify Files Are Correct**
   
   Check that these files exist:
   ```bash
   ls -la /Users/mohamedghaly/Desktop/WomaBackend/dashboard/js/products.js
   ls -la /Users/mohamedghaly/Desktop/WomaBackend/dashboard/products.html
   ```

#### 7. **Check Browser Network Tab**
   - Open Dev Tools (`F12`)
   - Go to **Network** tab
   - Reload the Products page
   - Look for:
     - `products.js` - should load successfully (200)
     - `/api/v1/admin/products/` - API call
   - Click on each to see if there are errors

---

## Expected Behavior

### What You Should See:

1. **Products Page:**
   - Column named "Variations"
   - Shows number (e.g., "9" or "0")
   - Button next to number:
     - "Manage" button if variations exist
     - "Add" button if no variations

2. **Click "Manage" or "Add":**
   - Large modal opens
   - Title: "Product Variations"
   - Shows product name and base price
   - Button: "➕ Add Variation"

3. **Variations List:**
   - If variations exist: Table with SKU, Color, Size, etc.
   - If no variations: "No variations yet..." message

4. **Add Variation Form:**
   - Click "➕ Add Variation"
   - Form appears with fields for Color, Size, Price, Stock
   - Fill and click "Save Variation"

---

## Common Issues & Solutions

### Issue: "Manage" button doesn't appear
**Cause:** Products don't have variations yet  
**Solution:** Click "Add" button instead, or run `python create_sample_variations.py`

### Issue: Modal doesn't open
**Cause:** JavaScript error or missing modal HTML  
**Solution:** Check browser console for errors, refresh page with `Cmd+Shift+R`

### Issue: "Loading variations..." never finishes
**Cause:** API error or authentication issue  
**Solution:** 
- Check if you're logged in (JWT token valid)
- Check backend is running
- Look at Network tab for failed requests

### Issue: Can't add variation - form doesn't submit
**Cause:** Missing required fields or JavaScript error  
**Solution:**
- Stock Quantity is required
- At least one of: Color, Size, or Material should be filled
- Check console for errors

### Issue: Variations count shows "0" but I added them
**Cause:** Variations added through API/admin, dashboard not refreshed  
**Solution:** 
- Close variations modal (refreshes automatically)
- Or manually refresh page

---

## Step-by-Step Visual Test

### Test 1: Open Products Page
```
✓ Login successful
✓ Navigate to Products
✓ See products table
✓ "Variations" column visible
✓ Numbers showing (0 or more)
```

### Test 2: Open Variations Modal
```
✓ Click "Manage" or "Add" button
✓ Modal opens (dark overlay appears)
✓ See product name at top
✓ See "Add Variation" button
```

### Test 3: Add a Variation
```
✓ Click "➕ Add Variation"
✓ Form appears
✓ Fill in: Color="Red", Size="Large", Stock=10
✓ Click "Save Variation"
✓ Success message appears
✓ Variation appears in table
```

### Test 4: Delete a Variation
```
✓ See variation in table
✓ Click "Delete" button
✓ Confirm deletion
✓ Variation disappears
✓ Success message shows
```

---

## Debug Mode

If nothing works, open browser console and type:

```javascript
// Check if functions exist
console.log(typeof manageVariations);  // Should show "function"
console.log(typeof loadVariations);    // Should show "function"

// Try manually
manageVariations('paste-product-id-here');
```

---

## Still Not Working?

Send me:
1. Screenshot of Products page
2. Screenshot of browser console (F12 → Console tab)
3. Screenshot of Network tab showing API calls
4. Output of: `ls -la /Users/mohamedghaly/Desktop/WomaBackend/dashboard/js/`

I'll help you debug! 🔧
