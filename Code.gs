//  Article
//
//    http://bitvectors.blogspot.com . . . . .
//
//  describes this application . . .

//  The doGet() and runQuery() functions and the
//  onOpen() trigger all see the spreadsheet,
//  so declare localSpreadSheet as a global
//  spreadsheet variable with the application
//  Script properties spreadSheetURL value . . .

var localSpreadSheet = SpreadsheetApp.openByUrl(PropertiesService.getScriptProperties().getProperty('spreadSheetURL'));

function onOpen()
{  
  //  Set up the header cells and spreadsheet
  //  formatting when the spreadsheet loads.
  //  This way, the Code.gs and BigQuerySPDemoApp.html
  //  files can build the spreadsheet themselves
  //  with minimal developer / user involvement . . .

  //  This function will place the headerArray array
  //  values in spreadsheet cell range A2:G2. Use \n
  //  as a line break for cell text

  //  If needed, this next line could clean out the
  //  cells
  //
  //    A4:G107
  //
  //  where the application writes but we'll leave
  //  them for now . . .

  //  localSpreadSheet.getRange('A4:G107').setValue(' ');. . .
  
  var headerArray = [
                      "First Zip\nDigit",
                      "Employee\nCount",
                      "Q1 Payroll\n(1 = $ 1K)",
                      "Total Annual Payroll\n(1 = $ 1K)",
                      "Total Establishment\nCount",
                      "Function for\nSelect Clause",
                      "Number of\nQuantiles"
                    ];

  //  These lines set cell values, format the sheet, etc.
  //  For cell range A3:G3 the background color #c9daf8
  //  draws a light blue . . .

  localSpreadSheet.getRange("A1:G2").setFontFamily("TimesNewRoman");
  localSpreadSheet.getRange("A1:G4").setHorizontalAlignment("center");
  localSpreadSheet.getRange("B6").setWrap(true);
  localSpreadSheet.getRange("B6:C106").setHorizontalAlignment("right");
  localSpreadSheet.getRange("A1").setValue("CENSUS BUREAU\nCOMPLETE ZIP CODE\nTOTALS FILE");
  localSpreadSheet.getRange("A1:G1").merge();
  localSpreadSheet.getRange("A1:G2").setFontWeight("bold");
  localSpreadSheet.getRange("A1:G1").setFontSize(24);
  localSpreadSheet.getRange("A2:G2").setFontSize(18);
  localSpreadSheet.getRange("A3:G3").setBackground("#c9daf8");
  localSpreadSheet.getRange("A3:G3").merge();
  localSpreadSheet.getRange('A4:G107').setFontFamily("Arial");
  localSpreadSheet.getRange("A4:G107").setFontSize(10);

  //  The setValues function takes an array as a parameter, but it
  //  wants a multi-dimensional array. To do this, wrap the array
  //  it will get inside an array of its own . . .

  localSpreadSheet.getRange("A2:G2").setValues([headerArray]);

  //  Set the column width values . . .
  
  localSpreadSheet.setColumnWidth(1, 126);
  localSpreadSheet.setColumnWidth(2, 126);
  localSpreadSheet.setColumnWidth(3, 150);
  localSpreadSheet.setColumnWidth(4, 229);
  localSpreadSheet.setColumnWidth(5, 218);
  localSpreadSheet.setColumnWidth(6, 226);
  localSpreadSheet.setColumnWidth(7, 127);
}

function clearSheet(){

  // The reset jQuery function in the HTML script section of
  //
  //     BigQuerySPDemoApp.html
  //
  // will call this function. This function clears out the
  // data in the spreadsheet to mirror the web page
  // behavior . . .
  
  localSpreadSheet.getRange("C4").clear();
  localSpreadSheet.getRange("A4:G106").clear();
}

function doGet(){

  //  A request made to the script URL runs the doGet() function.
  //  This function loads the HTML file BigQuerySPDemoApp.html in
  //  the browser . . .

  return HtmlService.createTemplateFromFile("BigQuerySPDemoApp.html").evaluate();
}

function returnFormParams(paramArray, headerArray){

  //  The last line of submitData() in BigQuerySPDemoApp.html
  //  called this function. This function will build and
  //  return the BigQuery result set back to submitData().

  //  Spreadsheet range A4:G107 covers all cells
  //  that function runQuery could potentially
  //  write . . .
  
  localSpreadSheet.getRange('A4:G107').setValue(' ');

  //  This line will place the first six elements of headerArray
  //  in cells A4:G4 respectively. Here, headerArray[7] has the
  //  DDLQUERY value, not the text. Therefore, it does not belong
  //  in the A4:G4 range.
  //
  //  The setValues function takes an array as a parameter, but it
  //  wants a multi-dimensional array. To do this, wrap the array
  //  it will get inside an array of its own . . .
  
  localSpreadSheet.getRange("A4:G4").setValues([headerArray.slice(0, 7)]);

  //  In paramArray, element 6 has the query name text.
  //  Remove this element from paramArray because the
  //  runQuery function will not use / need this array
  //  element . . .

  paramArray.splice(5, 1);

  //  In the spreadsheet, cell G4 (number of quantiles) has a value only if the user
  //  picked the quantiles function in the function dropdown. Cell G4 has a " " value
  //  for the other functions. The paramArray[6] element will always have a value,
  //  but for a non-quantiles function, it will have a " " value. Always show the
  //  quantiles value in G4, but change the cell background color: light gray for
  //  " " and white for an actual number value . . .

  if (paramArray[5] == " ") {
    localSpreadSheet.getRange('G4').setBackground("lightgray");
  }
  else {
    localSpreadSheet.getRange('G4').setBackground("white");
  }

  //  If the user already ran the app with the quantiles function
  //  and the quantiles function returned an empty result set,
  //  runQuery will gray out cell B7 to help illustrate the
  //  situation. Therefore, initialize the cell B7 background
  //  color . . .

  localSpreadSheet.getRange('B7').setBackground("white");

  //  The SPName variable value is a stored procedure
  //  in the CloudSQL / MySQL database. This SP uses
  //  variable paramArray as a parameter. With it, it transforms
  //  the user's picks on the web form into a BigQuery project
  //  query. The runQuery() function will then run this
  //  BigQuery query string in the BigQuery project to
  //  get the BigQuery result set. This "simulates" a
  //  BigQuery stored procedure . . .

  var SPName = '{call usp_return_BigQuery_SP(?)}';
  return runQuery(SPName, paramArray);
}

function runQuery(SPName, paramArray) {

  //  The localSPStringObject will query the CloudSQL
  //  database for the BigQuery query string that directly
  //  maps to paramArray, which in turn holds the web form
  //  parameter picks the user made . . .

  var localSPStringObject = new getSPStringObject(SPName);
  var queryString = localSPStringObject.queryString(paramArray);

  //  The method call returned the queryString
  //  value - now run that value in the BigQuery
  //  project, using the queryBQProject object.
  //  The queryBQProject object returns a
  //  two-element array . . .

  var BQQueryResults = queryBQProject(queryString);

  var queryResults = BQQueryResults[0];
  var rows = BQQueryResults[1];

  //  The headers array has the result
  //  set column names . . .

  var headers = queryResults.schema.fields.map(function(field) {
    return field.name;
  });
  
  //  The result set data will go into a
  //  nested array that will work as an
  //  array of arrays. The inner array(s)
  //  will have two values . . .

  var dataArray = [[]];

  //  In dataArray, dataArray[0][0] has the function
  //  name and dataArray[0][1] has the calculated
  //  value BigQuery returned . . .

  dataArray[0][0] = removeEscapeCharacters(headers[0]);

  if (headers.length == 1) {

    //  The headers[] array has one element, so the user picked a single-value
    //  result set function. If BigQuery returned NULL for the chosen parameters,
    //  place an information string in dataArray[0][1]; otherwise, place the
    //  returned non-null value in dataArray[0][1] . . .

    dataArray[0][1] = (rows[0].f[0].v === null) ? "No value calculated for chosen parameters" : rows[0].f[0].v;

  } else if (headers.length == 2) {

    //  The user picked a two-column result
    //  set - specifically, the quantiles
    //  function . . .

    dataArray[0][1] = removeEscapeCharacters(headers[1]);

    if (rows.length < 2) {

      //  The BigQuery quantiles function returned
      //  zero data rows for the parameters, so
      //  first, gray out cell B7 as a visual guide,
      //  and build a two-cell array that explains
      //  everything . . .

      localSpreadSheet.getRange('B7').setBackground("lightgray");

      var tempArray = new Array(2);

      tempArray[0] = " ";
      tempArray[1] = "No quantile values calculated for chosen parameters";

      //  The slice() method guarantees that tempArray[] will
      //  have the new values from the sourcing rows[] array.
      //  Without slice(), the push method will push arrays
      //  referenced by the last tempArray it pushed in this
      //  loop . . .

      dataArray.push(tempArray.slice());
    } else {

         //  Array tempArray will hold the quantile / quantile value pairs . . .

      var tempArray = new Array(2);

      for (var i = 0; i < rows.length; i++) {
        tempArray[0] = rows[i].f[0].v;
        tempArray[1] = rows[i].f[1].v;

        //  The slice() method guarantees that tempArray[] will
        //  have the new values from the sourcing rows[] array.
        //  Without slice(), the push method will push arrays
        //  referenced by the last tempArray it pushed in this
        //  loop . . .

        dataArray.push(tempArray.slice());
      }
    }
  }

  //  The dataArray array now has all the result set data. Nested loops could certainly
  //  place the dataArray array values in the spreadsheet cells, but it would take forever.
  //  Instead, place the entire assembled dataArray array in the spreadsheet, at the target
  //  location all at once. This will boost the speed.
  //
  //  The getRange function specifies the target location which starts at B6, extends to
  //  column C, and down to the row matching the length of dataArray[0]. Here, dataArray[0].length
  //  is the column length - AKA the number of quantile / quantile value pairs. Add 5 (five)
  //  because targetRange has five blank rows above it . . .

  var targetRange = "B6:C" + (dataArray.length + 5); 

  localSpreadSheet.getRange(targetRange).setValues(dataArray);

  //  This function will return the dataArray array to
  //  calling function returnFormParam in this file.
  //  Then, returnFormParam will return the dataArray
  //  array it to function callBack() in
  //  BigQuerySPDemoApp.html . . .

  return dataArray;
}

function removeEscapeCharacters (headerColString) {

  //  This function removes the escaped characters
  //  from the column aliases . . .

  headerColString = headerColString.replace(/_/g, ' ');
  headerColString = headerColString.replace(/x24/g, '$');
  headerColString = headerColString.replace(/x28/g, '(');
  headerColString = headerColString.replace(/x29/g, ')');
  headerColString = headerColString.replace(/x3d/g, '=');
  headerColString = headerColString.replace(/x5e/g, '^');

  return headerColString;
}