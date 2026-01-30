# Release Checklist

Use this checklist for every release to ensure consistency and quality.

## Pre-Release

### Code Quality
- [ ] All tests pass (if tests exist)
- [ ] No console errors in production build
- [ ] License validation works correctly
- [ ] All 5 channels work as expected
- [ ] History feature saves and loads correctly
- [ ] Save and Copy buttons function properly

### Version Management
- [ ] Update version in `package.json`
- [ ] Update `CHANGELOG.md` with new changes
- [ ] Commit all changes
- [ ] Create git tag: `git tag v1.0.0`

### Build & Test
- [ ] Run `npm run build`
- [ ] Test macOS .dmg installer
- [ ] Test Windows .exe installer (if applicable)
- [ ] Test Linux AppImage (if applicable)
- [ ] Verify app launches correctly
- [ ] Test license key validation
- [ ] Test OpenAI API integration
- [ ] Verify system tray functionality

## Release

### GitHub
- [ ] Push commits: `git push origin main`
- [ ] Push tags: `git push origin v1.0.0`
- [ ] Create GitHub Release
- [ ] Write release notes
- [ ] Upload platform installers (.dmg, .exe, .AppImage)
- [ ] Verify download links work

### Polar
- [ ] Update product description with new version number
- [ ] Update download links (if manual distribution)
- [ ] Test checkout flow
- [ ] Verify license key generation works
- [ ] Test license validation with new key

### Documentation
- [ ] Update README.md if needed
- [ ] Update CLAUDE.md if architecture changed
- [ ] Document any new features
- [ ] Update version number in docs

## Post-Release

### Verification
- [ ] Download installer as a customer would
- [ ] Complete full install on clean machine
- [ ] Enter license key
- [ ] Test all features
- [ ] Check for any errors in console

### Monitoring
- [ ] Monitor GitHub Issues for bug reports
- [ ] Check Polar dashboard for sales
- [ ] Respond to customer emails
- [ ] Note any common issues for next release

### Communication
- [ ] Email existing customers about update (if major)
- [ ] Post on social media (if applicable)
- [ ] Update any marketing materials
- [ ] Thank early adopters for feedback

## Version-Specific Notes

### v1.0.0 (Initial Release)
- First public release
- Focus on core functionality
- Establish baseline for future updates

### v1.x.x (Feature Updates)
- Incremental improvements
- Bug fixes from user feedback
- New channels or features

### v2.0.0 (Major Release)
- Breaking changes
- Require license revalidation if needed
- Detailed migration guide for users

## Emergency Hotfix Process

If critical bug is found post-release:

1. [ ] Create hotfix branch: `git checkout -b hotfix/v1.0.1`
2. [ ] Fix the bug
3. [ ] Test thoroughly
4. [ ] Bump patch version
5. [ ] Build and test
6. [ ] Release immediately
7. [ ] Merge back to main
8. [ ] Email affected users

## Rollback Plan

If a release causes major issues:

1. Mark GitHub Release as "pre-release"
2. Update download links to previous version
3. Notify customers via email
4. Fix issue in new version
5. Release as patch (e.g., v1.0.2)

## Notes

- Always test on a clean machine before releasing
- Keep release notes user-friendly (avoid technical jargon)
- If unsure, delay release - quality over speed
- First impression matters - make v1.0.0 solid
