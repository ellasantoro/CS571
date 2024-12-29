const Student = (props) => {
  return (
    <div>
      {
        //student data includes first, last, major, num credits, if they are from WI, and their interests in an unordered list.
        //Each child in the list has a unique key proposition, no error in console.
      }
      <h2>
        {props.name.first} {props.name.last}
      </h2>
      <p>
        <strong>{props.major}</strong>
      </p>
      <p>
        {props.name.first} is taking {props.numCredits} credits and is{" "}
        {props.fromWisconsin ? "from Wisconsin" : "NOT from Wisconsin"}{" "}
      </p>
      <p>They have {props.interests.length} interests including...</p>
      <ul>
        {props.interests.map((interest, i) => (
          <li key={i}>{interest}</li>
        ))}
      </ul>
    </div>
  );
};

export default Student;
