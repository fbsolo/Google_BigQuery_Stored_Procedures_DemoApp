function queryBQProject(queryString) {

  //  Use script properties defined at
  //
  //    File -> Project properties -> Script properties
  //
  //  for local variables the BigQuery
  //  result set machinery will need . . .
  
  var projectId = PropertiesService.getScriptProperties().getProperty('projectID');
  var request = {query: queryString};
  var queryResults = BigQuery.Jobs.query(request, projectId);
  var jobId = queryResults.jobReference.jobId;

  //  Get the entire BigQuery result set . . .

  var rows = queryResults.rows;

  while (queryResults.pageToken) {
    queryResults = BigQuery.Jobs.getQueryResults(projectId, jobId, {
      pageToken: queryResults.pageToken
    });
    rows = rows.concat(queryResults.rows);
  }

  //  Return a two-element array . . .
  
  return [queryResults, rows];
}