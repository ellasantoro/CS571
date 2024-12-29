/**
 * This function takes in student data, and creates a "section" (div) for each student including information
 * such as first name, last name, major, number of credits, if they are from wisconsin, and a list of interests.
 * Please note that createElement and appendChild were used for each node created for each student, as the writeup
 * states.
 * @param {*} studs 
 */
function buildStudents(studs) {
	const mainHTML = document.getElementById("students");
	mainHTML.innerHTML = ''; // clear out any existing instructions
	for (let step of studs) {
		const studDiv = document.createElement("div");
		let wiscText = ""; //used later for creditsAndWiscNode
		studDiv.className = "col-12 col-md-6 col-lg-4 col-xl-3 student";
		//style mostly visually copied from example screenshots & demo
		const nameNode = document.createElement("h2");
		const majorNode = document.createElement("p");
		const creditsAndWiscNode = document.createElement("p");
		const interestsHeaderNode = document.createElement("p");
		interestsHeaderNode.innerText = "They have " + step.interests.length + " interests, including...";
		const interestsNode = document.createElement("ul");
		//use a for loop to create individual li elements for the list for each individual interest 
		for (let i = 0; i < step.interests.length; i++) {
			const subInterestsNode = document.createElement("li");
			subInterestsNode.innerText = step.interests[i];
			//event listener for clicking on "sub-interests" (i.e. individual interests from the students' lists)
			//it must be placed here because we cannot access this node elsewhere. When the interests are clicked, the
			//specific clicked interest will be passed into the handleSearch function, so it will be successfully searched
			//and filtered!
			subInterestsNode.addEventListener("click", (e) => {
				const selectedText = e.target.innerText;
				document.getElementById("search-interest").value = selectedText;
				handleSearch(e);
			});
			interestsNode.appendChild(subInterestsNode);
		}

		nameNode.innerText = step.name.first + " " + step.name.last;
		majorNode.innerText = step.major;
		//combined credits and from wisconsin nodes to create the same format as the example screenshot:
		if (step.fromWisconsin === false) {
			wiscText = " is not from Wisconsin.";
		} else {
			wiscText = " is from Wisconsin.";
		}
		creditsAndWiscNode.innerText = step.name.first + " is taking " + step.numCredits + " credits this semester and" + wiscText;

		//append all children to the specific student's div, then append that div to the mainHTML element:
		//RESOURCE CITATION: ChatGPT was used to understand how to properly structure this section. I asked how to separate
		//the students from each other using a div in a JS file as opposed to HTML file as I had tried to create a div and put the other
		//elements within by simply sandwiching it in the code. This did not work. It gave me the idea to append the elements to the div, then
		//append the div to my main element. No code was copied. 
		studDiv.appendChild(nameNode);
		studDiv.appendChild(majorNode);
		studDiv.appendChild(creditsAndWiscNode);
		studDiv.appendChild(interestsHeaderNode);
		studDiv.appendChild(interestsNode);
		mainHTML.appendChild(studDiv);
	}
}

/**
 * This function takes in a search for name, major, and interests (or any subset of those options), and allows for
 * a user to filter through the student data to find a specific person, major, or interest. 
 * @param {*} e 
 */
function handleSearch(e) {
	e?.preventDefault(); // You can ignore this; prevents the default form submission!
	//Please note that innerHTML is used here only to clear the page so that we can show the filtered results.
	document.getElementById("students").innerHTML = '';
	//create vars for each search type by connecting them to their respective tag ids in the HTML file
	let nameSearch = document.getElementById("search-name").value.toLowerCase().trim();
	let majorSearch = document.getElementById("search-major").value.toLowerCase().trim();
	let interestsSearch = document.getElementById("search-interest").value.toLowerCase().trim();
	//filter through the student data in order to show the specific requested data:
	let filterStuds = studentData.filter(s => {
		let nameRes = (s.name.first + " " + s.name.last).toLowerCase();
		let majorRes = s.major.toLowerCase();
		//use map to turn each interest into a fully lowercase string ; will allow us to compare strings appropriately
		let interestsRes = s.interests.map(str => str.toLowerCase());
		//compare each student's name/major/interest to the name/major/interest search, if it is not included, exclude 
		//from results by returning false (that is how filter method works)
		if (!nameRes.includes(nameSearch)) {
			return false;
		}
		if (!majorRes.includes(majorSearch)) {
			return false;
		}

		//use the some method in order to see if any of the student's interests match the searched interest:
		if (interestsSearch && !interestsRes.some(interest => interest.includes(interestsSearch))) {
			return false;
		}

		return true;
	});
	//update num results to ensure that the number matches this new filtered data
	document.getElementById("num-results").innerText = filterStuds.length;
	//call buildStudents while passing in the filtered student data so that we can rebuild the page with only the
	//speciifc filtered data:
	buildStudents(filterStuds);
}

/**
 * This function fetches data from the url provided and reads in student data from HW0. Some code structure from this method
 * is copied from ICE3, specific implementation was completed independently.
 */
function fetchData() {
	fetch("https://cs571api.cs.wisc.edu/rest/f24/hw2/students", {
		method: "GET",
		headers: {
			"X-CS571-ID": CS571.getBadgerId()
		}
	})
		//parse data if successful, handle errors otherwise:
		.then(res => {
			if (res.status === 200) {
				return res.json();
			} else {
				throw new Error();
			}
		})
		//set the studentData var to this data we fetched, that way we can access throughout the file.
		.then(data => {
			studentData = data;
			//update the number of results appropriately 
			document.getElementById("num-results").innerText = studentData.length;
			//build the page based on this new student data we retrieved.
			buildStudents(studentData);
			console.log(studentData);
		})

}
let studentData = [];
fetchData();
document.getElementById("search-btn").addEventListener("click", handleSearch);
