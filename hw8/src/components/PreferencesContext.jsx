import { createContext} from 'react';
//nothing is really used here, more of a setup. Stuff is initialized in badgerPreferencesScreen, and updated throughout
export const PreferencesContext = createContext({preferences: {}, setPreferences: () => {}, tags: [],setTags: () => {}});
