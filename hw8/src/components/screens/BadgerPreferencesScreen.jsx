import React, { useContext, useState, useEffect } from 'react';
import { Switch, StyleSheet, Text, ScrollView, View } from 'react-native';
import { PreferencesContext } from '../PreferencesContext';

function BadgerPreferencesScreen(props) {
  const { preferences, setPreferences, tags } = useContext(PreferencesContext); // use context for preferences and tags
  const [localPreferences, setLocalPreferences] = useState(preferences);

  useEffect(() => {
    //Get object length: https://www.freecodecamp.org/news/check-if-an-object-is-empty-in-javascript/
    if (Object.keys(localPreferences).length === 0) {
      //create default settings with each tag set to true so that everything gets displayed
      const defaultSettings = tags.reduce((base, tag) => {base[tag] = true; return base;}, {});
      //actually update these settings
      setLocalPreferences(defaultSettings);
      setPreferences(defaultSettings);
    }
  }, [tags, localPreferences, setPreferences]);

  //deal with non-default/intial settings (i.e. toggle specific tags)
  const toggleSwitch = (tag) => {
    //create a new prerferences list by creating a shallow copy using Object.assign
    //creating copies of objects: https://www.sitepoint.com/shallow-vs-deep-copying-in-javascript
    const newPreferences = Object.assign({}, localPreferences);
    //do the switch! this takes our shallow copy and accesses the current (a specific) tag 
    //and negates it (switches it to the opposite value)
    newPreferences[tag] = !localPreferences[tag];
    //then we actually update the settings as follows:
    setLocalPreferences(newPreferences);
    setPreferences(newPreferences);
  };
  
  //note that some of this code is taken and changed from the given resource,
  //https://reactnative.dev/docs/switch
  return (
    <ScrollView style={styles.scrollContainer}>
      {tags.map((tag) => (
        <View key={tag}>
         <Text key={tag} style={styles.text}>
            {preferences[tag] ? `Currently showing ${tag} articles` : `Currently NOT showing ${tag} articles`}
          </Text>
          <View style = {styles.switchContainer}>
          <Switch style={styles.switch}
          //https://reactnative.dev/docs/switch - ios doesn't show the false trackColor option, but
          //using ios_backgroundColor is a work-around.
            ios_backgroundColor={"#e06c6c"}
            //from the above resource, linked
            trackColor={{false: "#e06c6c", true: "#7dde7a"}}
            thumbColor={localPreferences[tag] ? '#4e8c4c' : '#c23e3e'}
            onValueChange={() => toggleSwitch(tag)}
            value={localPreferences[tag] || false} 
          />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
 scrollContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  switchContainer: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 50,
    paddingTop: 10

  },
  text: {
    textAlign: "center",
    fontFamily: "Georgia",
    fontSize: 18

  }
});

export default BadgerPreferencesScreen;
