# Push Notifications Troubleshooting Guide
**Date**: December 13, 2025  
**Status**: Desktop Working ✅ | Mobile Safari Not Working ❌

## Current Issue

Push notifications work perfectly on desktop but fail on mobile Safari (iPhone).

### Symptoms
1. `NotificationSettingsCard` appears inconsistently on mobile (requires multiple refreshes)
2. Test notification button doesn't send notification to phone
3. Match assignment notification not received on phone during live test
4. Component seems to not load properly on Safari

### What's Working ✅
- Desktop browser notifications (tested and confirmed)
- PWA installation on desktop
- Backend push service (`PushNotificationService`)
- API endpoints (`/api/push/*`)
- Match assignment trigger (sends notification after match creation)
- Service worker registration

### What's Not Working ❌
- Mobile Safari push notifications
- Consistent loading of `NotificationSettingsCard` on mobile
- Hook state management on Safari

## Root Cause Hypotheses

### 1. **iOS Version Compatibility** (MOST LIKELY)
- Push notifications only work on iOS 16.4+
- User's iOS version not confirmed
- **Action**: Check Settings → General → About → Software Version

### 2. **Service Worker Registration Timing**
- Hook checks subscription before service worker is ready on mobile
- Safari may have stricter timing requirements
- `navigator.serviceWorker.ready` might not resolve properly

### 3. **Safari Push API Support Detection**
- Hook's `checkSupport()` might incorrectly detect Safari support
- Safari has specific requirements for PWA installation before push works
- May need to check if app is installed (standalone mode)

### 4. **HTTPS Requirement**
- Push notifications require HTTPS in production
- localhost works for testing, but actual deployment needs valid SSL
- Current deployment status: Unknown

## Debugging Steps Added

### Frontend Debug Logging
Added console logs to `usePushNotifications.ts`:
- Logs support check with detailed breakdown
- Logs subscription check status
- Logs user agent for device identification

Added console logs to `NotificationSettingsCard.tsx`:
- Logs component state changes
- Shows isSupported, isSubscribed, permission status

### Test Button
Added "Test" button to `NotificationSettingsCard`:
- Sends `POST /api/push/test` request
- Shows immediate feedback
- Easier than triggering real match assignment

### Backend Test Endpoint
Added `POST /api/push/test` endpoint:
- Sends test notification to current user
- Returns success/failure result
- Bypasses match assignment flow

## Next Steps (Priority Order)

### 1. Verify iOS Version (5 min)
**Check if iOS 16.4+**
- Settings → General → About → Software Version
- If < 16.4: Push notifications won't work on Safari
- Solution: Use Chrome on Android, or upgrade iOS

### 2. Enable Safari Web Inspector (10 min)
**Mac + iPhone via USB**:
- iPhone: Settings → Safari → Advanced → Enable "Web Inspector"
- Mac: Safari → Develop → [iPhone Name] → [Next-Up]
- View console logs with detailed support checks

**Expected logs**:
```
[Push Notifications] Support check: { serviceWorker: true, PushManager: true, Notification: true }
[Push Notifications] Current subscription: Active/None
[NotificationSettingsCard] State: { isSupported: true, ... }
```

### 3. Check PWA Installation Status (2 min)
**Safari may require PWA to be installed**:
- iPhone Safari → Share → Add to Home Screen
- Open from home screen (not browser)
- Try enabling notifications again

### 4. Verify HTTPS in Production (if deployed)
- Check if production uses HTTPS
- Push notifications require secure context
- localhost is exempt but production is not

### 5. Fix Hook Timing (15 min)
**If service worker not ready**:
```typescript
const checkSubscription = async () => {
  try {
    // Wait longer for service worker
    await navigator.serviceWorker.register('/service-worker.js');
    const registration = await navigator.serviceWorker.ready;
    // ... rest of logic
  } catch (error) {
    console.error('Service worker not ready:', error);
  }
};
```

### 6. Add Safari-Specific Checks (20 min)
**Detect standalone mode**:
```typescript
const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
const isSafariPWA = 'standalone' in navigator && navigator.standalone;

if (!isStandalone && !isSafariPWA) {
  // Show "Install app first" message for Safari
}
```

## Temporary Workaround

**For immediate use**:
- Desktop browser notifications work perfectly
- Admin can test on desktop
- Users can use Android Chrome (full push support)
- iOS users must wait for Safari fix

## Quick Win: Score & Partnership Notifications

**Once mobile is fixed, add these triggers** (15 min each):

### Score Submission Notification
In `matchController.js` → `submitMatchScore()`:
```javascript
// After creating pending score
const opponentUserIds = [partnership.player1_id, partnership.player2_id];
await pushNotificationService.notifyScoreSubmitted(match, opponentUserIds);
```

### Partnership Request Notification
In `leagueNightController.js` → `createPartnershipRequest()`:
```javascript
// After creating request
await pushNotificationService.notifyPartnershipRequest(request, targetUserId);
```

## Files Modified Tonight

### New Files
- `/code/client/public/manifest.json` - PWA manifest
- `/code/client/public/service-worker.js` - Service worker for offline + push
- `/code/server/migrations/create_push_subscriptions_table.sql` - Database table
- `/code/server/src/services/pushNotificationService.js` - Push notification logic
- `/code/server/src/routes/push.js` - API endpoints for subscriptions
- `/code/client/src/hooks/usePushNotifications.ts` - React hook for managing push
- `/code/client/src/components/NotificationPermission.tsx` - UI components

### Modified Files
- `/code/client/index.html` - Added manifest link
- `/code/client/src/main.tsx` - Service worker registration + message handler
- `/code/server/index.js` - Added push routes
- `/code/server/.env` - Added VAPID keys
- `/code/server/src/controllers/matchController.js` - Match notification trigger
- `/code/client/src/pages/DashboardPage.tsx` - Added banner
- `/code/client/src/pages/ProfilePage.tsx` - Added settings card
- `/Docs/ARCHITECTURE.md` - Documented push_subscriptions table

## Environment Variables Added

**Backend `.env`**:
```
VAPID_PUBLIC_KEY=BIu0Aa5_z6XS60vO6gAYsootulEzROh6JvxOCR6Z4mrFwYLhRWEb2V3NpX0I2t4Plq4rHhlYhucXBq_j8JtPCyY
VAPID_PRIVATE_KEY=Ur6VdO0tVlWk9gJHFZnm_p0LVixO6DSa0TYUNjNIQP0
VAPID_SUBJECT=mailto:luke.renton@next-up.co.za
```

**Keep these secure!** Don't commit to public repos.

## Resume Debugging Session

**Quick start when you're ready**:
1. Check iOS version on phone
2. Connect iPhone to Mac via USB
3. Open Safari Web Inspector
4. Reload app on phone
5. Check console for `[Push Notifications]` logs
6. Try test button and observe errors
7. Report findings

**Key question to answer**: Is `isSupported` true or false on Safari?

If false → Safari detection issue  
If true → Subscription/registration issue

Good luck! 🚀
