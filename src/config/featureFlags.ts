export const features = {
    simplifiedUi: false, // Default to false as requested, will be overridden by logic or config
    aepRemediation: true,
    governanceTelemetry: true,
};

export const isFeatureEnabled = (feature: keyof typeof features): boolean => {
    // In a real app, this might check local storage, user attributes, or remote config
    return features[feature];
};

export const setFeatureFlag = (feature: keyof typeof features, value: boolean) => {
    features[feature] = value;
};
