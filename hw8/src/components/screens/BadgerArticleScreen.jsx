import {Image, Text, ScrollView, View, Linking, Animated, StyleSheet} from "react-native";
import { useEffect, useState, useRef } from "react";

function SpecificBadgerScreen(props) {
  const { id, title, img } = props.route.params;
  const [articleDetails, setArticleDetails] = useState(null);
  //we use the value -400 here because we are placing the image off screen to the left by 400
  //cool animation resource, used to figure out sliding among other animation things, its outdated but was able
  //to derive some things:
  //https://docs.swmansion.com/react-native-reanimated/docs/2.x/api/LayoutAnimations/entryAnimations/
  const slideAnim = useRef(new Animated.Value(-400)).current;
  const [fadeAnim1] = useState(new Animated.Value(0));
  const [fadeAnim2] = useState(new Animated.Value(0));
  const [fadeAnim3] = useState(new Animated.Value(0));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //fetch article by id (we gain id by using props.route.params, which was taken from the
    //stack navigation snack: https://snack.expo.dev/@ctnelson1997/stack-navigation - did it slightly differently
    //since didnt use useNavigation())
    fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw8/article?id=${id}`, {
      method: 'GET',
      headers: {
        "X-CS571-ID":
          "bid_9c50525a849c91aa6beb9e5fb48d0c346bf3fb11cf8c4828c67ace062a69cfd6",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setArticleDetails(data);
        setLoading(false);

        //all (except first) animations are delayed to create a smooth one-by-one effect
        //animation for sliding the image in
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }).start();

          //animation for fading the title in
          Animated.timing(fadeAnim1, {
            toValue: 1,
            delay: 800,
            duration: 1500,
            useNativeDriver: true,
          }).start();

        //animation for fading the author & date in
        Animated.timing(fadeAnim2, {
            toValue: 1,
            delay: 1200,
            duration: 1500,
            useNativeDriver: true,
          }).start();

        //animatin for fading the main text in
        Animated.timing(fadeAnim3, {
          toValue: 1,
          delay: 1750,
          duration: 1500, 
          useNativeDriver: true,
        }).start();
      });
  }, [id]);

  //created separate function so that handling Linking was less complicated
  //I vaguely recall using a source that gave me the idea to do this externally,
  //but I can't remember which website it was from and I forgot to comment it.
    const handleLinking = () => {
      //syntax from https://reactnative.dev/docs/linking#example
      Linking.openURL(articleDetails.url);
    }

    return (
      <ScrollView style={styles.scrollView}>
        {loading ? ( <View style={styles.loadingBox}>
          <Text style={styles.loading}>Loading article...</Text>
          <Image
          source={{
            uri: "https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif"
          }}
          style={styles.loadingImage}
        />
        </View>
        ) : (
          <View>
            {
              //use translateX to move the image from its current position -400 to 0 (we set 0 as the target),
              //making it look like it slides in
            }
            <Animated.View style={[styles.imageContainer, { transform: [{ translateX: slideAnim }] }]}>
              <Image
                source={{
                  uri: "https://raw.githubusercontent.com/CS571-F24/hw8-api-static-content/main/" + img,
                }}
                style={styles.image}
              />
            </Animated.View>
  
            <Animated.View style={[styles.titleContainer, { opacity: fadeAnim1 }]}>
              <Text style={styles.title}>{title}</Text>
            </Animated.View>
  
            <Animated.View style={[styles.authorContainer, { opacity: fadeAnim2 }]}>
              <Text style={styles.authorText}>By {articleDetails.author} on {articleDetails.posted}</Text>
              <Text onPress={handleLinking} style={styles.linkText}> Read full article here </Text>
            </Animated.View>
            <Animated.View style={[styles.bodyContainer, { opacity: fadeAnim3 }]}>
              {
                //had to add the ?'s as it kept giving me errors that implied it was undefined at times.
              }
              {articleDetails?.body?.map((content, index) => (
                <Text style={styles.bodyText} key={index}>{content}</Text>
              ))}
            </Animated.View>
          </View>
        )}
      </ScrollView>
    );
  };
  
  const styles = StyleSheet.create({
    scrollView: {
      marginTop: 16,
    },
    loading: {
      textAlign: "center",
      fontSize: 20,
      fontFamily: "Georgia",
      padding: 20,
    },
    image: {
      width: 400,
      height: 200,
    },
    titleContainer: {
      paddingTop: 20,
      paddingBottom: 10,
      padding: 10,
      alignItems: "center"
    },
    title: {
      fontFamily: "Georgia",
      fontWeight: "bold",
      fontSize: 20,
      textAlign: "center"
    },
    authorContainer: {
      padding: 10,
      alignItems: "center"
    },
    authorText: {
      fontStyle: "italic",
      textAlign: "center"
    },
    linkText: {
      color: "#3bcaed",
      textAlign: "center",
      fontWeight: "bold",
      fontFamily: "Georgia",
      padding: 10,
    },
    bodyContainer: {
      paddingBottom: 20,
      textAlign: "center",
    },
    bodyText: {
      fontFamily: "Georgia",
      padding: 10,
      textAlign: "center",
    },
    loadingImage: {
      height: 100,
      width: 100,
      alignContent: "center",
      margin: 10
    },
    loadingBox: {
      paddingTop: 200,
      alignContent: "center",
      alignItems: "center"
    }
  });

export default SpecificBadgerScreen;