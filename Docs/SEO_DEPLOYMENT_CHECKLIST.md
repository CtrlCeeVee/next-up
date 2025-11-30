# SEO Deployment Checklist

## ✅ Files Changed

All changes are in the `/code/client` directory:

### Modified:
- `index.html` - Added comprehensive meta tags, Open Graph, structured data

### Created:
- `public/robots.txt` - Search engine crawling instructions
- `public/sitemap.xml` - Site structure for search engines
- `public/OG_IMAGE_INSTRUCTIONS.md` - Guide for creating social share image

### Documentation Added:
- `Docs/SEO_GUIDE.md` - Complete SEO implementation guide
- `Docs/GOOGLE_ANALYTICS_SETUP.md` - Analytics installation instructions

## 🚀 Deployment Steps

### 1. Test Locally

```bash
cd code/client
npm run dev
```

Visit http://localhost:5173 and:
- View page source (Ctrl+U)
- Confirm meta tags are visible
- Check `/robots.txt` loads
- Check `/sitemap.xml` loads

### 2. Build and Deploy

```bash
# Build production version
npm run build

# Deploy to Vercel (if using Vercel)
vercel --prod

# OR push to GitHub (if auto-deploy configured)
git add .
git commit -m "Add comprehensive SEO: meta tags, OG, structured data, sitemap"
git push origin main
```

### 3. Verify Live Changes

Once deployed to https://next-up.co.za:

**A. Check Meta Tags**
- Visit homepage
- View source (Ctrl+U or right-click → View Page Source)
- Confirm all meta tags are present

**B. Test Open Graph**
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/
- Enter: https://next-up.co.za
- ⚠️ Will show warnings until you create og-image.png

**C. Validate Structured Data**
- Google Rich Results Test: https://search.google.com/test/rich-results
- Enter: https://next-up.co.za
- Should show: "SoftwareApplication" and "Organization" schemas detected

**D. Check Files**
- Visit: https://next-up.co.za/robots.txt
- Visit: https://next-up.co.za/sitemap.xml
- Both should load correctly

### 4. Submit to Search Engines

**Google Search Console**
1. Go to: https://search.google.com/search-console
2. Add property: https://next-up.co.za
3. Verify ownership (HTML meta tag method already added to index.html - look for verification code option)
4. Submit sitemap: https://next-up.co.za/sitemap.xml
5. Request indexing for homepage

**Bing Webmaster Tools**
1. Go to: https://www.bing.com/webmasters
2. Add site: https://next-up.co.za
3. Verify ownership
4. Submit sitemap
5. Request indexing

### 5. Create OG Image (ASAP)

**Required**: 1200x630px image at `/code/client/public/og-image.png`

Quick options:
- **Canva**: Use "Facebook Post" template (free)
- **Figma**: Create 1200x630 frame
- **Online tools**: https://www.opengraph.xyz/

Include:
- Next-Up logo
- "Real-Time Pickleball League Management"
- Pickleball visual
- Brand colors

### 6. Install Google Analytics

See: `Docs/GOOGLE_ANALYTICS_SETUP.md`

1. Get tracking ID from https://analytics.google.com
2. Add snippet to index.html before `</head>`
3. Deploy
4. Verify in Analytics → Real-time

## 🔍 Validation Tools

### Before Going Live
- [ ] Local build succeeds: `npm run build`
- [ ] No console errors in browser
- [ ] All meta tags visible in source

### After Deployment
- [ ] Homepage loads correctly
- [ ] robots.txt accessible
- [ ] sitemap.xml accessible
- [ ] Meta tags in source
- [ ] Open Graph validator passes (after OG image added)
- [ ] Structured data validator passes
- [ ] Google Search Console verified
- [ ] Sitemap submitted
- [ ] Google Analytics tracking

### Mobile Check
- [ ] Google Mobile-Friendly Test: https://search.google.com/test/mobile-friendly
- [ ] Should pass all checks

### Performance Check
- [ ] Google PageSpeed Insights: https://pagespeed.web.dev/
- [ ] Target: 90+ on all metrics

## 📊 Expected Timeline

**Day 1 (Today)**:
- Deploy SEO changes
- Verify all files load correctly
- Submit to Search Console
- Create OG image

**Day 2-3**:
- Google starts crawling
- May appear in "site:next-up.co.za" search

**Week 1**:
- Indexed pages increase
- Brand searches start working ("Next-Up pickleball")

**Week 2-4**:
- Start ranking for long-tail keywords
- Analytics shows organic traffic

**Month 2-3**:
- Ranking improves for competitive terms
- Regular backlinks and content boost rankings

## 🎯 Success Metrics

After 1 week:
- [ ] At least 5 pages indexed (check Search Console)
- [ ] Appears in Google for "next-up pickleball"
- [ ] No crawl errors in Search Console

After 1 month:
- [ ] 50+ organic visits
- [ ] Ranking for brand + pickleball terms
- [ ] 2+ backlinks

After 3 months:
- [ ] 500+ organic visits/month
- [ ] Top 10 for "pickleball league software"
- [ ] 10+ quality backlinks

## ⚠️ Common Issues

**Issue**: Changes not visible on live site
**Fix**: Hard refresh (Ctrl+Shift+R) or clear cache

**Issue**: OG image not showing
**Fix**: Create og-image.png at exact location, then use Facebook Debugger to refresh

**Issue**: Sitemap 404
**Fix**: Ensure public/ folder files copy to dist/ during build (check vite.config.ts)

**Issue**: Search Console verification fails
**Fix**: Ensure index.html changes are deployed, try DNS verification instead

**Issue**: Not appearing in Google after 2 weeks
**Fix**: Manually request indexing in Search Console for each page

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify build output includes robots.txt and sitemap.xml
3. Use validation tools above
4. Email: luke.renton@next-up.co.za

---

**Next Steps After Deployment**:
1. Create OG image (1 hour)
2. Submit to Search Console (30 mins)
3. Install Analytics (15 mins)
4. Monitor for 1 week
5. Start content marketing (see SEO_GUIDE.md)
