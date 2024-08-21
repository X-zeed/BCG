function doGet(e) {
  Logger.log(JSON.stringify(e));
  var result = 'Ok';

  if (typeof e.parameter === 'undefined') {
    result = 'No Parameters';
  } else {
    var sheet_id = '1t15bLbJyMZDeonLLWS8pBCQDyWGp-r4lYQ0_CJVYdmQ'; // Spreadsheet ID
    var sheet = SpreadsheetApp.openById(sheet_id).getActiveSheet();
    var data = sheet.getDataRange().getValues(); // Get all data from the sheet
    var userExists = false;
    var existingRow = -1;
    var scoreColumnIndex = 6; // Column where score is stored (Column G)
    var newScore = 0;

    // Parse parameters
    var rowData = [];
    var Curr_Date = new Date();
    rowData[0] = Curr_Date; // Date in column A
    var Curr_Time = Utilities.formatDate(Curr_Date, "Asia/Bangkok", 'HH:mm:ss');
    rowData[1] = Curr_Time; // Time in column B

    var user = '';
    var gender = '';
    var fname = '';
    var lname = '';
    var score = 0;

    for (var param in e.parameter) {
      Logger.log('In for loop, param=' + param);
      var value = stripQuotes(e.parameter[param]);
      Logger.log(param + ':' + e.parameter[param]);
      switch (param) {
        case 'user':
          user = value;
          var lastRow = sheet.getLastRow();
          for (var row = 2; row <= lastRow; row++) {
            var cellValue = data[row - 1][2];  // แถวที่ row, คอลัมน์Cคือ [2]
            if (cellValue == value) {
              userExists = true;
              var existingScore = data[row - 1][6];  // Current score in column G
              var updatedScore = existingScore + score;
              sheet.getRange(row, 7).setValue(updatedScore);
              rowData[10]='loop';
            }
            else {

            }
          }
          result = 'OK';
          break;
        case 'gender':
          gender = value;
          result += ', OK';
          break;
        case 'fname':
          fname = value;
          result += ', OK';
          break;
        case 'lname':
          lname = value;
          result += ', OK';
          break;
        case 'score':
          score = parseInt(value);
          result += ', OK';
          break;
        default:
          result = "unsupported parameter";
      }
      rowData[2] = user;
      rowData[3] = gender;
      rowData[4] = fname;
      rowData[5] = lname;
      rowData[6] = score;
    }

    // Check if user exists in the sheet
    for (var i = 1; i < data.length; i++) {
      if (data[i][2] === user) { // Column C (index 2) holds the 'user' value
        userExists = true;
        existingRow = i + 1; // Adjust for 1-based index in Google Sheets
        newScore = data[i][scoreColumnIndex] + score; // Add the new score to the existing score
        break;
      }
    }

    if (userExists) {
      // Update the existing row with the new score
      sheet.getRange(existingRow, scoreColumnIndex + 1).setValue(newScore);
    } else {
      // Add a new row with the data
      var newRow = sheet.getLastRow() + 1;
      var newRange = sheet.getRange(newRow, 1, 1, rowData.length);
      newRange.setValues([rowData]);
    }
  }

  return ContentService.createTextOutput(result);
}

function stripQuotes(value) {
  return value.replace(/^["']|['"]$/g, "");
}
