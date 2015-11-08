function getSPStringObject(SPName) {

  //  Set up the stored procedure call for the
  //  CloudSQL / MySQL database. The
  //
  //    conn.prepareCall(SPName)
  //
  //  function will run the stored procedure
  //  name value in parameter
  //
  //    SPName
  //
  //  in that database. That stored procedure returns
  //  a BigQuery SQL statement "mapped" to the
  //  parameters in paramArray . . .

  var conn = new dbConnectionObject();
  var stmt1 = conn.prepareCall(SPName);

  //  We want getSPStringObject objects to have the queryString
  //  function publically available, but we want to keep the
  //  internal function machinery hidden. To do this, use a
  //  JavaScript closure . . .

  this.queryString = (function() {
    return function(paramArray) {
      var SPText = paramArray.toString();
      stmt1.setString(1, SPText);

      var results = stmt1.executeQuery();
      var localQueryString = ' ';

      //  We have to use results.next() in a while loop, even for a one-row
      //  one-column result set. This is the only way Google Apps Script
      //  can see the actual result set values.
      //
      //  Look at the row in results - the result set variable. Inside
      //  the row, extract the (column) value and place it in variable
      //  queryString.
      //
      //  The results record set is forward-only, so we have no way to
      //  see the exact number of rows it has. Therefore, parse it with
      //  a while-loop . . .

      while (results.next()) {
        localQueryString = results.getString(1);
      }

      return localQueryString;
    }
  })();

}