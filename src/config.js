export const getConfig = () => {
    // At runtime, read from window.__ENV__ (set by Railway via env vars)
    // Fallback to process.env for local dev
    return {
        dataState: window.__ENV__?.dataState || 'dev6',
        masterKey: window.__ENV__?.xMasterKey || null,
    };
};