# Debugging Proxy Configuration

## Quick Test Steps

### 1. Start the development server
```bash
npm start
```

### 2. Check proxy logs
When you start the server, you should see proxy debug logs in the terminal like:
```
[HPM] Proxy created: /am/**  -> https://cdk.example.com
[HPM] Proxy created: /oauth2/**  -> https://cdk.example.com
```

### 3. Test proxy manually
Open a new terminal and test the proxy directly:
```bash
# This should be proxied to ForgeRock
curl -k https://localhost:4200/am/json/serverinfo/*

# Expected: JSON response from ForgeRock AM
# Error: Would show CORS or connection issues
```

### 4. Check browser network tab
1. Open `https://localhost:4200` in browser
2. Open Developer Tools > Network tab
3. Try to login
4. Look for requests to `/am/json/realms/.../authenticate`
5. Check if they show Status 200 or CORS errors

## Common Issues & Fixes

### Issue: "CORS request did not succeed"
**Cause**: Proxy not intercepting requests
**Fix**: 
1. Ensure you started with `npm start` (includes `--proxy-config`)
2. Check terminal for proxy creation logs
3. Verify proxy.conf.json paths match your requests

### Issue: "ERR_CERT_AUTHORITY_INVALID" or "self-signed certificate" 
**Cause**: SSL certificate validation issues between proxy and ForgeRock
**Fix**: 
1. Proxy configured with `"secure": false` to ignore cert validation
2. Accept self-signed certificate warning in browser for localhost:4200

### Issue: "404 Not Found" on /am/** requests
**Cause**: ForgeRock server not accessible or wrong target URL
**Fix**: 
1. Update `proxy.conf.json` target to your actual ForgeRock URL
2. Verify ForgeRock is running and accessible

### Issue: Requests going to wrong URL
**Check**: Browser DevTools > Network tab
- Requests should go to `https://localhost:4200/am/...`
- NOT to `https://cdk.example.com/am/...` directly

## Environment Configuration

### Development (proxy enabled):
```typescript
amUrl: '/am'  // Relative path, gets proxied
```

### Production (direct connection):
```typescript
amUrl: 'https://cdk.example.com/am'  // Full URL, direct
```

## Successful Proxy Flow

1. Angular app makes request to `https://localhost:4200/am/json/...`
2. Angular dev server intercepts `/am/**` requests
3. Proxy forwards to `https://cdk.example.com/am/json/...`
4. ForgeRock responds through proxy
5. Browser receives response as same-origin (no CORS)