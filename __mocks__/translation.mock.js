// __mocks__/translation.mock.js

// Localize component: replaces placeholders in text with provided values
const Localize = ({ i18n_default_text, values }) => {
    const localizedText = i18n_default_text.replace(/\{\{(\w+)\}\}/g, (match, key) => values[key] || match);
    return localizedText || null;
};

// Mock for useTranslations hook
const useTranslations = () => ({
    localize: jest.fn((text, args) => {
        return text.replace(/{{(.*?)}}/g, (_, match) => args[match.trim()]);
    }),
    currentLang: 'EN',
});

// Simple localize mock
const localize = jest.fn(text => text);

// Mock for allowed languages
const getAllowedLanguages = jest.fn(() => ({
    EN: 'English',
    VI: 'Tiếng Việt',
    ES: 'Español',
    FR: 'Français',
}));

// Mock for i18n initialization
const initializeI18n = jest.fn(() => {});

export {
    getAllowedLanguages,
    initializeI18n,
    Localize,
    localize,
    useTranslations,
};
