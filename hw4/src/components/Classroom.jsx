import { Button, Container, Form, Row, Col, Pagination } from "react-bootstrap";
import { useEffect, useState } from "react";
import Student from "./Student";

const Classroom = () => {
  const [studData, setStudData] = useState([]);
  const [nameQuery, setNameQuery] = useState("");
  const [majorQuery, setMajorQuery] = useState("");
  const [interestsQuery, setInterestsQuery] = useState("");
  const [filteredStudentSearch, setFilteredStudentSearch] = useState([]);
  const [page, setPage] = useState(1);

  const resultsPerPage = 24;

  useEffect(() => {
    fetch("https://cs571api.cs.wisc.edu/rest/f24/hw4/students", {
      headers: {
        "X-CS571-ID": CS571.getBadgerId(),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setStudData(data);
        //console log the contents of the array, no 429 HTTP code from the server.
        console.log(data);
      });
  }, []);

  useEffect(() => {
    //search functionality that appears as a user types. User may search by name, major, and interests
    //cannot click on interests to search, not needed as stated in the "Important" section of the writeup.
    //search terms are case-insensitive, substrings, searches are AND expressions, if any interest matches
    //the search term, it is considered a result, a blank search term does not affect search results, and leading
    //and trailing spaces are ignored.
    const handleSearch = () => {
      const filteredStuds = studData.filter((stud) => {
        const nameMatch = (stud.name.first + " " + stud.name.last)
          .toLowerCase()
          .includes(nameQuery.toLowerCase().trim());
        const majorMatch = stud.major
          .toLowerCase()
          .includes(majorQuery.toLowerCase().trim());
        const interestsMatch = stud.interests.some((interest) =>
          interest.toLowerCase().includes(interestsQuery.toLowerCase().trim())
        );
        return (
          (nameMatch || !nameQuery) &&
          (majorMatch || !majorQuery) &&
          (interestsMatch || !interestsQuery)
        );
      });

      setFilteredStudentSearch(filteredStuds);
      setPage(1);
    };
    handleSearch();
  }, [nameQuery, majorQuery, interestsQuery, studData]);

  const totalPages = Math.ceil(filteredStudentSearch.length / resultsPerPage);

  //pagination has up to 24 results per page, and the current page is highlighted in blue. Furthermore,
  //as the search results update, so does the number of pagination items. Whenever a search term is updated,
  //the pagination shows that the user is back on page 1. Each pagination item also has a unique key, and there
  //are next/previous buttons so that the user can go to the next or previous page. The previous button is disabled if user is
  //on the first page, and next button is disabled if on the last page.
  const paginator = () => {
    const studPagesArr = [];

    studPagesArr.push(
      <Pagination.Prev
        key="previous"
        disabled={page === 1}
        onClick={() => setPage((prevPage) => Math.max(1, prevPage - 1))}
      >
        {" "}
        Previous{" "}
      </Pagination.Prev>
    );

    //NOTE: taken and edited from https://react-bootstrap.netlify.app/docs/components/pagination/
    for (let number = 1; number <= totalPages; number++) {
      studPagesArr.push(
        <Pagination.Item
          key={number}
          active={page === number}
          onClick={() => setPage(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    studPagesArr.push(
      <Pagination.Next
        key="next"
        disabled={page === totalPages}
        onClick={() =>
          setPage((prevPage) => Math.min(totalPages, prevPage + 1))
        }
      >
        {" "}
        Next{" "}
      </Pagination.Next>
    );
    return studPagesArr;
  };

  return (
    <div>
      <h1>Badger Book</h1>
      <p>Search for students below!</p>
      <hr />
      <Form>
        <Form.Label htmlFor="searchName">Name</Form.Label>
        <Form.Control
          id="searchName"
          value={nameQuery}
          onChange={(e) => setNameQuery(e.target.value)}
        />
        <Form.Label htmlFor="searchMajor">Major</Form.Label>
        <Form.Control
          id="searchMajor"
          value={majorQuery}
          onChange={(e) => setMajorQuery(e.target.value)}
        />
        <Form.Label htmlFor="searchInterest">Interest</Form.Label>
        <Form.Control
          id="searchInterest"
          value={interestsQuery}
          onChange={(e) => setInterestsQuery(e.target.value)}
        />
        <br />
        {
          //onclick handler to reset the search, clearing the search term fields. Because we set all of the search fields
          //to an empty string, the number of results will be appropriately updated back to the total number of students in the array
          //(without searching).
        }
        <Button
          variant="neutral"
          onClick={() => {
            setNameQuery("");
            setMajorQuery("");
            setInterestsQuery("");
          }}
        >
          Reset Search
        </Button>
      </Form>
      {
        //display the number of students returned below the search form, accurate to array length,
        //or if a search is entered, updated to the correct filteredStudentSearch length (i.e. upon search
        //there will be less results and the number will be appropriately updated)
      }
      <p>
        There are {filteredStudentSearch.length} student(s) matching your
        search.
      </p>
      <Container fluid>
        <Row>
          {filteredStudentSearch
            .slice((page - 1) * resultsPerPage, page * resultsPerPage)
            .map((stud) => (
              //use students id as the key, no error saying that each child in list should have unique key
              //format using react boostrat, 1 column for xs and sm, 2 columns for md, 3 cols for lg, and 4 cols for xl.
              //resizing the browser will show these working columns.
              <Col key={stud.id} xs={12} sm={12} md={6} lg={4} xl={3}>
                <Student {...stud} />
              </Col>
            ))}
        </Row>
        <Row>
          <Pagination>{paginator()}</Pagination>
        </Row>
      </Container>
    </div>
  );
};

export default Classroom;
