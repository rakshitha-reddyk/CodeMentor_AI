# 🌐 Network Connectivity Issue - ERR_NAME_NOT_RESOLVED

## Current Error

The browser cannot reach Supabase because of a network error: **ERR_NAME_NOT_RESOLVED**

This means the domain `pmdvdunlkphexfpyxwny.supabase.co` cannot be resolved.

## Possible Causes

1. **No Internet Connection** ❌
   - Check if other websites load
   - Test: ping google.com or open any other site

2. **DNS Issues** 🔍
   - Your DNS server can't resolve the Supabase domain
   - Try changing DNS: use 8.8.8.8 (Google DNS) or 1.1.1.1 (Cloudflare)

3. **Firewall/Network Block** 🔒
   - Corporate networks often block external APIs
   - Contact your IT department
   - Try on a different network (mobile hotspot, public WiFi)

4. **Supabase Service Down** ⚠️
   - Check: https://status.supabase.com/

5. **VPN/Proxy Interference** 🛡️
   - Try disabling VPN or proxy
   - Configure VPN to route to Supabase

## Quick Fixes (Try These First)

### 1️⃣ Full Page Refresh

```
Press: Ctrl+Shift+R  (or Cmd+Shift+R on Mac)
This clears cache and forces a fresh connection
```

### 2️⃣ Check Internet Connection

1. Open a new tab
2. Go to https://google.com
3. If it loads, your internet is working

### 3️⃣ Test Supabase Connectivity

1. Open browser console (F12 → Console)
2. Run: `checkSupabaseHealth()`
3. Look for "Network reachable" status
4. If ❌, your firewall/DNS is blocking it

### 4️⃣ Try Different Network

- Connect to a different WiFi
- Use mobile hotspot
- This helps identify if it's a network block

## Advanced Troubleshooting

### Check DNS Resolution

**Windows:**

```powershell
nslookup pmdvdunlkphexfpyxwny.supabase.co
```

**Mac/Linux:**

```bash
dig pmdvdunlkphexfpyxwny.supabase.co
```

Expected: Should show IP address like `1.2.3.4`
If fails: Your DNS can't resolve it

### Try Different DNS

**Windows:**

1. Settings → Network & Internet → WiFi
2. Manage Known Networks
3. Edit your WiFi
4. DNS Settings → Manual
5. Preferred DNS: 8.8.8.8
6. Alternate DNS: 8.8.4.4
7. Refresh Learn page

**Mac:**

1. System Preferences → Network → WiFi
2. Advanced → DNS
3. Click + button
4. Add: 8.8.8.8
5. Refresh Learn page

### Check Supabase Status

Visit: https://status.supabase.com/

- Look for "Supabase Database API" status
- If ⚠️ red, service might be down

## If Nothing Works

### Option 1: Use Localhost Data

The app can work with mock/local data while network is down. Check `src/components/Learn.tsx` for offline fallback options.

### Option 2: Contact Support

Provide:

1. Screenshot of the error
2. Output from running `checkSupabaseHealth()` in console
3. Your network details (corporate WiFi? VPN?)
4. Error message from browser console

### Option 3: Check Logs

Look for error details:

1. F12 → Console tab
2. Look for messages starting with ❌ or 🌐
3. Screenshot and send these details

## Verification Checklist

- [ ] Internet connection is working (test with google.com)
- [ ] F12 console shows specific error (screenshot it)
- [ ] `checkSupabaseHealth()` ran successfully
- [ ] Tried full page refresh (Ctrl+Shift+R)
- [ ] Tried different WiFi/network
- [ ] Firewall settings not blocking Supabase domain

## Still Having Issues?

1. Use the "Diagnose" button in the Learn page error state
2. Run `checkSupabaseHealth()` in console (F12)
3. Share the output in the console for debugging
