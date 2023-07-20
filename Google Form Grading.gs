var ss = SpreadsheetApp.getActiveSpreadsheet();
var sheet = ss.getActiveSheet();
var dataRange = sheet.getRange(1,1,100,4);
var data = dataRange.getValues()

const dailyScore = 1
const latePenalty = data[2][3]

var studentScores = new Object();
var exitTicketUrls = []

// Create a menu for the user to use to run the program
function onOpen() {
   var menu = SpreadsheetApp.getUi().createMenu("Grading");
   menu.addItem("Calculate Class Grades", "fillScores");
   menu.addToUi();
}

// This takes the calculated scores and puts them in the spreadsheet
function fillScores() {
  getScores()
  // Use the hash table to fill in the scores for all students
  var row = 9
  while (data[row][0]) {
    email = data[row][0]
    data[row][1] = studentScores[email]
    row += 1
  }

  // Send scores back to spreadsheet
  scores = data.slice(9,row);
  sheet.getRange(10,1,scores.length,scores[0].length).setValues(scores)
}

// This looks through all the exit tickets to get the scores
function getScores() {
  importStudentsAndFormIDs()
  for (var url of exitTicketUrls) {
    if (url) {
      scoreExitTicket(url)
    } 
  }
}

// This gets the students and exit tickets from the spreadsheet
function importStudentsAndFormIDs() {
  // Read the student emails into the hash table
  var row = 9
  while (data[row][0]) {
    studentScores[data[row][0]] = 0
    row += 1
  }

  for (let r = 2; r <= 6; r++) {
    exitTicketUrls.push(data[r][1])
  }
}

// This looks through the responses for an individual exit ticket and adds those scores to each students' total
function scoreExitTicket(formUrl) {
  var form = FormApp.openByUrl(formUrl);
  var formResponses = form.getResponses();
  dueDate = findDueDate(form)
  for (var i = 0; i < formResponses.length; i++) {
    var email = formResponses[i].getRespondentEmail();
    if (studentScores.hasOwnProperty(email)) {
      if (formResponses[i].getTimestamp() < dueDate) {
        studentScores[email] += dailyScore
      }
      else {
        studentScores[email] += dailyScore*latePenalty
      }
    }
  }
}

// This function finds the due date, assuming the due date was when the most students submitted the form
function findDueDate(form) {
  submissionDays = []
  submissionMonths = []
  submissionYears = []
  var formResponses = form.getResponses();

  // Find the dates, months, and years that all students submitted on
  for (var i = 0; i < formResponses.length; i++) {
    var submitDate = formResponses[i].getTimestamp().getDate();
    submissionDays.push(submitDate)
    var submitMonth = formResponses[i].getTimestamp().getMonth();
    submissionMonths.push(submitMonth)
    var submitYear = formResponses[i].getTimestamp().getFullYear();
    submissionYears.push(submitYear)
  }

  // Find the modal date, month, and year
  dueDate = mode(submissionDays)
  dueMonth = mode(submissionMonths)
  dueYear = mode(submissionYears)
  
  // Set due date time to the last second on the day that the most students submitted
  dueTime = new Date(dueYear,dueMonth,dueDate,23,59,59,999)
  return dueTime
}

// Find the mode of an array (from RosettaCode)
function mode(ary) {
    var counter = {};
    var mode = [];
    var max = 0;
    for (var i in ary) {
        if (!(ary[i] in counter))
            counter[ary[i]] = 0;
        counter[ary[i]]++;

        if (counter[ary[i]] == max) 
            mode.push(ary[i]);
        else if (counter[ary[i]] > max) {
            max = counter[ary[i]];
            mode = [ary[i]];
        }
    }
    return mode; 
}

