# Changesets

This folder is managed by [changesets](https://github.com/changesets/changesets).

To record a change for the next release, run:

```bash
pnpm changeset
```

Select the affected packages and a semver bump, then write a short summary. On merge to
`main`, the release workflow opens a "Version Packages" PR; merging that PR publishes the
updated packages to npm.
