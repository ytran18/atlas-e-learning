# GrowthBook Feature Flags Setup

## Overview

GrowthBook is configured for feature flagging in this project. It's fully integrated at the app level and ready to use.

## Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_GROWTHBOOK_ID=sdk-your-client-key-here
```

**Where to find your Client Key:**

1. Go to [GrowthBook Dashboard](https://app.growthbook.io)
2. Navigate to **Settings** → **API Keys** → **SDK Endpoints**
3. Copy the **Client Key** (starts with `sdk-`)

## Usage

### Basic Feature Flag (Boolean) - Recommended

**With Ready State (Recommended):**

```tsx
import { useFeatureFlag } from "@/libs/growthbook";

export const MyComponent = () => {
    const { isReady, value: isNewFeatureEnabled } = useFeatureFlag("new-feature");

    // Show loading state while GrowthBook is initializing
    if (!isReady) {
        return <Loading />;
    }

    if (isNewFeatureEnabled) {
        return <NewFeature />;
    }

    return <OldFeature />;
};
```

**Simple (No Loading State):**

```tsx
import { useFeatureFlagSimple } from "@/libs/growthbook";

export const MyComponent = () => {
    // Note: May return default value during initial load
    const isNewFeatureEnabled = useFeatureFlagSimple("new-feature");

    return isNewFeatureEnabled ? <NewFeature /> : <OldFeature />;
};
```

### Feature Flag with Value

```tsx
import { useFeatureFlagValue } from "@/libs/growthbook";

export const UploadComponent = () => {
    const maxUploadSize = useFeatureFlagValue<number>("max-upload-size", 10);
    const theme = useFeatureFlagValue<string>("theme-color", "blue");

    return (
        <div>
            <p>Max upload: {maxUploadSize}MB</p>
            <p>Theme: {theme}</p>
        </div>
    );
};
```

### Conditional Rendering

```tsx
import { useFeatureFlag } from "@/libs/growthbook";

export const Dashboard = () => {
    const { isReady, value: showBetaFeatures } = useFeatureFlag("beta-features");
    const { value: enableDarkMode } = useFeatureFlag("dark-mode");

    if (!isReady) {
        return <DashboardSkeleton />;
    }

    return (
        <div className={enableDarkMode ? "dark" : ""}>
            <h1>Dashboard</h1>
            {showBetaFeatures && <BetaPanel />}
        </div>
    );
};
```

## Creating Feature Flags in GrowthBook

1. Go to [GrowthBook Dashboard](https://app.growthbook.io)
2. Navigate to **Features** → **Add Feature**
3. Create your feature flag:
    - **Key**: `new-feature` (use kebab-case)
    - **Type**: `Boolean` (for on/off) or `JSON` (for complex values)
    - **Default Value**: `false` or your default
4. Enable/disable the feature from the dashboard

## Testing Locally

1. Create a feature flag in GrowthBook dashboard
2. Set it to `ON`
3. Your app will automatically pick up changes (subscribeToChanges is enabled)
4. No restart needed - flags update in realtime during development

## Architecture

```
src/libs/growthbook/
├── get-growthbook-payload.ts    # Server-side payload fetching
├── make-growthbook.ts            # Client-side GrowthBook instance
├── use-feature-flag.ts           # React hooks for feature flags
└── index.ts                      # Public exports
```

## Best Practices

1. **Naming Convention**: Use kebab-case for feature keys (`new-dashboard`, `beta-upload`)
2. **Default Values**: Always provide sensible defaults
3. **Cleanup**: Remove feature flags after full rollout
4. **Documentation**: Document feature flags in code comments

## Troubleshooting

**Feature flag flickering between true/false?**

- This is normal during GrowthBook initialization
- Use `useFeatureFlag` (with `isReady`) instead of `useFeatureFlagSimple`
- Check `isReady` before rendering based on flag value
- Example: `const { isReady, value } = useFeatureFlag("my-flag")`

**Feature flag not updating?**

- Check console for GrowthBook errors
- Verify `NEXT_PUBLIC_GROWTHBOOK_ID` is set
- Ensure feature key matches exactly (case-sensitive)

**Changes not reflected?**

- Feature flags update in realtime during development
- In production, changes may take a few seconds to propagate

**Console showing multiple renders?**

- Normal React behavior + GrowthBook async loading
- Use `isReady` to avoid acting on uninitialized values

## Resources

- [GrowthBook Docs](https://docs.growthbook.io)
- [Feature Flag Guide](https://docs.growthbook.io/features)
