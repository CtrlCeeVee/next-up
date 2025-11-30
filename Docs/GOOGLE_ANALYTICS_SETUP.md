# Google Analytics Setup

## Step 1: Get Your Tracking ID

1. Go to https://analytics.google.com
2. Create account (or sign in)
3. Add property: "Next-Up"
4. Get your Measurement ID (looks like: `G-XXXXXXXXXX`)

## Step 2: Add to Your Site

Copy your Measurement ID and replace `G-XXXXXXXXXX` in the code below.

Then add this snippet to `/code/client/index.html` right before the closing `</head>` tag:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    'anonymize_ip': true,
    'cookie_flags': 'SameSite=None;Secure'
  });
</script>
```

## Step 3: Verify Installation

1. Deploy your changes
2. Visit your site
3. Open Google Analytics > Real-time
4. You should see your own visit

## What to Track

Google Analytics will automatically track:
- Page views
- User sessions
- Bounce rate
- Traffic sources
- Geographic data
- Device types

## Custom Events (Optional - Add Later)

Track specific actions:

```javascript
// Track signup
gtag('event', 'sign_up', {
  method: 'Email'
});

// Track league join
gtag('event', 'join_league', {
  league_id: leagueId,
  league_name: leagueName
});

// Track check-in
gtag('event', 'check_in', {
  league_id: leagueId
});

// Track partnership formed
gtag('event', 'form_partnership', {
  league_id: leagueId
});
```

## Privacy Considerations

We've included:
- `anonymize_ip: true` - Anonymizes last IP octet
- `cookie_flags: 'SameSite=None;Secure'` - Secure cookies

Update your Privacy Policy to mention Google Analytics usage.

## Environment Variables (Recommended)

For better organization, use environment variables:

**.env.local**:
```
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**In your React app** (create `src/utils/analytics.ts`):

```typescript
// src/utils/analytics.ts
export const initGA = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  
  if (!measurementId) {
    console.warn('Google Analytics ID not configured');
    return;
  }

  // Load GA script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize GA
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  gtag('js', new Date());
  gtag('config', measurementId, {
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure'
  });
};

export const trackEvent = (
  eventName: string, 
  params?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};
```

**In `src/main.tsx`**:
```typescript
import { initGA } from './utils/analytics';

// After ReactDOM.createRoot
if (import.meta.env.PROD) {
  initGA();
}
```

This keeps analytics out of development and uses environment variables for the ID.
