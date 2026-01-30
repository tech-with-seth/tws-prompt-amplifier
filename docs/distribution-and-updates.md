# Distribution and Updates Strategy

## Overview

This document outlines the strategy for distributing Prompt Amplifier and managing updates.

## Distribution Options

### Recommended: Polar + GitHub Releases

**Why this combination:**
- Zero platform fees (Polar is free for creators)
- Full control over pricing and licensing
- Professional auto-update experience
- Already integrated (license validation in place)

**How it works:**
1. Customer purchases on Polar
2. Polar generates and emails license key
3. Customer downloads app from GitHub Releases
4. Customer enters license key in app
5. App validates with Polar API
6. Future updates download automatically

### Alternative Options

#### Gumroad
- **Pros**: Simple setup, handles payments
- **Cons**: 10% fee, manual update notifications
- **Best for**: Quick launch, testing market fit

#### LemonSqueezy
- **Pros**: Merchant of record, handles tax
- **Cons**: 5% + processing fees
- **Best for**: International sales, subscription billing

## Auto-Update Implementation

### Phase 1: MVP (Launch)
**Goal**: Get to market quickly

```
Distribution: Polar
Hosting: GitHub Releases (public or private repo)
Updates: Manual email notifications
```

**Setup:**
1. Create GitHub repo
2. Create Polar product with license key benefit
3. Release v1.0.0 to GitHub Releases
4. Link to download in Polar product description

### Phase 2: Auto-Updates (Post-Launch)
**Goal**: Professional user experience

```
Distribution: Polar
Hosting: GitHub Releases
Updates: electron-updater (automatic)
```

## Auto-Update Setup

### 1. Install Dependencies

```bash
npm install electron-updater
```

### 2. Configure package.json

Add to `package.json`:

```json
{
  "build": {
    "appId": "com.yourname.promptamplifier",
    "productName": "Prompt Amplifier",
    "publish": {
      "provider": "github",
      "owner": "your-username",
      "repo": "prompt-amplifier",
      "private": false
    },
    "mac": {
      "category": "public.app-category.productivity",
      "hardenedRuntime": true,
      "gatekeeperAssess": false,
      "entitlements": "build/entitlements.mac.plist",
      "entitlementsInherit": "build/entitlements.mac.plist"
    },
    "win": {
      "target": "nsis"
    },
    "linux": {
      "target": "AppImage"
    }
  }
}
```

### 3. Update main.js

Add auto-update logic to `main.js`:

```javascript
const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

// Configure logging
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

function createWindow() {
  // ... existing window creation code
}

app.on('ready', () => {
  createWindow();

  // Check for updates (only in production)
  if (!app.isPackaged) {
    console.log('Skipping auto-update check in development');
  } else {
    autoUpdater.checkForUpdatesAndNotify();
  }
});

// Optional: Check for updates every hour
setInterval(() => {
  if (app.isPackaged) {
    autoUpdater.checkForUpdatesAndNotify();
  }
}, 3600000);

// Auto-updater events (optional logging)
autoUpdater.on('checking-for-update', () => {
  log.info('Checking for update...');
});

autoUpdater.on('update-available', (info) => {
  log.info('Update available.');
});

autoUpdater.on('update-not-available', (info) => {
  log.info('Update not available.');
});

autoUpdater.on('error', (err) => {
  log.error('Error in auto-updater. ' + err);
});

autoUpdater.on('download-progress', (progressObj) => {
  log.info('Download speed: ' + progressObj.bytesPerSecond);
  log.info('Downloaded ' + progressObj.percent + '%');
});

autoUpdater.on('update-downloaded', (info) => {
  log.info('Update downloaded');
  // Update will be installed on next restart
});
```

### 4. GitHub Setup

**Create Personal Access Token:**
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token with `repo` scope
3. Save token securely

**Set Environment Variable:**
```bash
export GH_TOKEN=your_github_token_here
```

## Release Process

### Manual Release (Phase 1)

```bash
# 1. Update version
npm version patch  # 1.0.0 -> 1.0.1

# 2. Build app
npm run build

# 3. Manually upload to GitHub Releases
# Go to GitHub → Releases → Create new release
# Upload .dmg (Mac), .exe (Windows), .AppImage (Linux)

# 4. Update Polar product with new download link
```

### Automated Release (Phase 2)

```bash
# 1. Update version
npm version patch

# 2. Build and publish
GH_TOKEN=your_token npx electron-builder --publish always

# This automatically:
# - Builds installers for all platforms
# - Uploads to GitHub Releases
# - Creates update manifest
# - Tags the release
```

## Update User Experience

### What Users See:

1. **App checks for update on startup**
   - Happens silently in background
   - No interruption to workflow

2. **Update available notification**
   - Native system notification
   - "Update available for Prompt Amplifier"
   - One-click to download

3. **Download happens in background**
   - User can continue working
   - Progress logged (not visible to user)

4. **Install on next restart**
   - User quits app normally
   - Update installs automatically
   - App reopens with new version

## Cost Analysis

| Method | Setup Cost | Per-Sale Cost | Ongoing Cost |
|--------|-----------|---------------|--------------|
| Polar + GitHub | Free | Free | Free |
| Gumroad | Free | 10% | Free |
| LemonSqueezy | Free | 5% + fees | Free |
| Custom (Stripe) | Development time | 2.9% + 30¢ | Server costs |

## Recommended Launch Strategy

### Week 1: Launch
- Use Polar for sales
- Manual distribution via GitHub Releases
- Email buyers with download link + license key
- Collect feedback

### Week 2-4: Iterate
- Fix bugs
- Add requested features
- Manual update emails to existing customers

### Month 2: Auto-Update
- Implement electron-updater
- Release v1.1.0 with auto-update
- Future updates happen automatically

## Files to Create

### docs/release-checklist.md
```markdown
# Release Checklist

## Before Release
- [ ] All tests pass
- [ ] Update CHANGELOG.md
- [ ] Update version in package.json
- [ ] Build on all platforms (Mac, Windows, Linux)
- [ ] Test installers on each platform

## Release
- [ ] Create GitHub Release
- [ ] Upload installers
- [ ] Update Polar product page
- [ ] Test download links
- [ ] Test license key validation

## After Release
- [ ] Monitor for error reports
- [ ] Check update mechanism works
- [ ] Respond to user feedback
```

## Security Considerations

### Code Signing (Recommended for Production)

**Mac:**
- Requires Apple Developer account ($99/year)
- Prevents "unidentified developer" warnings
- Required for Mac App Store

**Windows:**
- Requires code signing certificate
- Prevents SmartScreen warnings
- Recommended for professional distribution

**Note:** Start without code signing to validate market, add later for better UX.

## Support & Maintenance

### Version Numbering
Follow semantic versioning (semver):
- `1.0.0` - Initial release
- `1.0.1` - Bug fixes
- `1.1.0` - New features
- `2.0.0` - Breaking changes

### Update Cadence
- **Critical bugs**: Patch immediately (1.0.1)
- **Minor features**: Monthly releases (1.1.0)
- **Major features**: Quarterly releases (2.0.0)

## Resources

- [electron-builder docs](https://www.electron.build/)
- [electron-updater docs](https://www.electron.build/auto-update)
- [Polar docs](https://docs.polar.sh/)
- [GitHub Releases docs](https://docs.github.com/en/repositories/releasing-projects-on-github)
