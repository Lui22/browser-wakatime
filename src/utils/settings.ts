import browser from 'webextension-polyfill';
import config, { ExtensionStatus, LoggingStyle, LoggingType, Theme } from '../config/config';

export interface Settings {
  allowList: string[];
  apiKey: string;
  apiUrl: string;
  denyList: string[];
  extensionStatus: ExtensionStatus;
  hostname: string;
  loggingEnabled: boolean;
  loggingStyle: LoggingStyle;
  loggingType: LoggingType;
  socialMediaSites: string[];
  theme: Theme;
  trackSocialMedia: boolean;
}

export const getSettings = async (): Promise<Settings> => {
  const settings = (await browser.storage.sync.get({
    allowList: [],
    apiKey: config.apiKey,
    apiUrl: config.apiUrl,
    blacklist: null,
    denyList: [],
    hostname: config.hostname,
    loggingStyle: config.loggingStyle,
    loggingType: config.loggingType,
    socialMediaSites: config.socialMediaSites,
    theme: config.theme,
    trackSocialMedia: true,
    whitelist: null,
  })) as Omit<Settings, 'socialMediaSites'> & {
    blacklist?: string;
    socialMediaSites: string[] | string;
    whitelist?: string;
  };

  // backwards compatibility
  if (typeof settings.whitelist === 'string') {
    settings.allowList = settings.whitelist.trim().split('\n');
    await browser.storage.sync.set({ allowList: settings.allowList });
    await browser.storage.sync.remove('whitelist');
  }
  if (typeof settings.blacklist === 'string') {
    settings.denyList = settings.blacklist.trim().split('\n');
    await browser.storage.sync.set({ denyList: settings.denyList });
    await browser.storage.sync.remove('blacklist');
  }
  if (typeof settings.socialMediaSites === 'string') {
    settings.socialMediaSites = settings.socialMediaSites.trim().split('\n');
    await browser.storage.sync.set({
      socialMediaSites: settings.socialMediaSites,
    });
  }

  return {
    allowList: settings.allowList,
    apiKey: settings.apiKey,
    apiUrl: settings.apiUrl,
    denyList: settings.denyList,
    extensionStatus: settings.extensionStatus,
    hostname: settings.hostname,
    loggingEnabled: settings.loggingEnabled,
    loggingStyle: settings.loggingStyle,
    loggingType: settings.loggingType,
    socialMediaSites: settings.socialMediaSites,
    theme: settings.theme,
    trackSocialMedia: settings.trackSocialMedia,
  };
};

export const saveSettings = async (settings: Settings): Promise<void> => {
  return browser.storage.sync.set(settings);
};
