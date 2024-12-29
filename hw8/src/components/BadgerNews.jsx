import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import BadgerTabs from './navigation/BadgerTabs';
import { PreferencesContext } from './PreferencesContext';

export default function BadgerNews(props) {
  // Just a suggestion for Step 4! Maybe provide this to child components via context...
  const [prefs, setPrefs] = useState({preferences: {}, tags: []});

  useEffect(() => {
    fetch("https://cs571api.cs.wisc.edu/rest/f24/hw8/articles", {
      headers: {
        "X-CS571-ID": "bid_9c50525a849c91aa6beb9e5fb48d0c346bf3fb11cf8c4828c67ace062a69cfd6",
      },
    })
      .then(res => res.json())
      .then(data => {
        //create a new array by extracting (map) the tags from each article in the data, this essentially gives us an array of arrays where
        //each innermost array contains the tags for a specific article, then we use reduce to iterate over each of the tags, and we use concat to 
        //to conactenate the current tags array with the base array (which will hold all the ones before)
        //ChatGPT assisted in coming to this final conclusion (i.e. back and forth chat using one line of code that I had trouble debugging)
        const allTags = [...new Set(data.map(article => article.tags).reduce((base, tags) => base.concat(tags), []))];
        //actually set the preference to the mapping/array creation we just did:
        setPrefs(prev => ({...prev, tags: allTags}));
      });
  }, []);

  return <>
    <PreferencesContext.Provider value={{ 
      preferences: prefs.preferences, 
      //update preferences by maintaining the old ones and updating with what has changed
      setPreferences: (newPrefs) => setPrefs(prev => ({ ...prev, preferences: newPrefs })), 
      tags: prefs.tags 
    }}>
    <NavigationContainer>
      <BadgerTabs/>
    </NavigationContainer>
    </PreferencesContext.Provider>
  </>
}
