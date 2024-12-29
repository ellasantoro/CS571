import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { PreferencesContext } from '../PreferencesContext';

function BadgerNewsScreen(props) {
  const { preferences } = useContext(PreferencesContext);
  const [articles, setArticles] = useState([]);

  //use a useEffect to fetch the articles, ensure that preferences is listed as a dependency so
  //it re-renders upon a preferences change (since we will be filtering articles)
  useEffect(() => {
    fetch("https://cs571api.cs.wisc.edu/rest/f24/hw8/articles", {
      headers: {
        "X-CS571-ID": "bid_9c50525a849c91aa6beb9e5fb48d0c346bf3fb11cf8c4828c67ace062a69cfd6",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        //use the data, but filter by tag:
        //we are essentially creating a new array that iterates over every article
        //within the data we just fetched
        const filteredArticles = data.filter((article) =>
        //here we use the .some method so that if an article contains at least one of the same
        //tag then it should be shown (checks the preference and compares to false for this. if true,
        //then show.)
          article.tags.some((tag) => preferences[tag] !== false)
        );
        //actually set the articles to this new filtered array. 
        setArticles(filteredArticles);
      });
  }, [preferences]);


  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      {articles.length === 0 ? (
        <Text>No articles are available based on your article preferences. Check the Preferences tab to fix this!</Text>
      ) : (
        articles.map((article) => (
          <TouchableOpacity
            key={article.id}
            onPress={() =>
              //https://reactnative.dev/docs/navigation
              //essentially, here we are using the idea of "navigation.navigate" from the source above to navigate to a page
              //called "Article", which we created in BadgerTabs.
              //CHATGPT USAGE NOTE: navigation.navigate was not working like the source said, so I asked why this may be happening.
              //eventually, it came to understand that it was because the navigation system was in a separate file, and so in my 
              //specific code, I am using props to help manage the navigation, so we just append the method to props.
              props.navigation.navigate("Article", {
                //here we want to pass in a few things that fetching each article's details won't give us.
                //while we get author, date, and the actual story, we don't get a new instance of id, title, or img, so we
                //just pass these in instead so we can use them in the other file that creates the actual article screen.
                id: article.fullArticleId,
                title: article.title,
                img: article.img,
              })
            }>
            <Card style={styles.card}>
              <Card.Content>
                <Card.Cover
                  source={{
                    uri: "https://raw.githubusercontent.com/CS571-F24/hw8-api-static-content/main/" + article.img,
                  }}
                />
                <Text style={styles.text}>{article.title}</Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    padding: 10,
    backgroundColor: "#ededed",
  },
  card: {
    width: '100%',
    marginBottom: 20,
    alignSelf: 'center',
    borderRadius: 8,
  },
  text: {
    textAlign: 'center',
    paddingTop: 15,
    fontWeight: 'bold',
    fontSize: 17,
    fontFamily: 'Georgia',
  },
});

export default BadgerNewsScreen;
