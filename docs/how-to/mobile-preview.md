# Preview the mobile clients


Install workspace dependencies first. Customer mobile reads commerce products and order history; employee mobile reads directory and leave snapshots. Start the relevant backend profile before opening Expo.

Use `pnpm dev:customer-mobile` or `pnpm dev:employee-mobile`. Expo can open a web preview without a device build. Repository builds export both applications for web. The native apps use React Native components rather than the DOM components in the shared web UI package.

A physical device cannot reach your computer through its own 127.0.0.1 address. Set the app's EXPO_PUBLIC URL to the host LAN address and configure backend binding accordingly. These values are public configuration, not secret transport.

Both mobile workspaces pin the same Expo, React, and React Native versions. If module resolution breaks, inspect duplicate dependencies before adding custom Metro aliases. Reinstall with the committed lockfile instead of upgrading one mobile application independently.
