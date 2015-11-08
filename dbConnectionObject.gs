function dbConnectionObject() {

  //  Private variables . . .
  
  var db = PropertiesService.getScriptProperties().getProperty('db');
  var address = PropertiesService.getScriptProperties().getProperty('address');
  var user = PropertiesService.getScriptProperties().getProperty('user');
  var userPwd = PropertiesService.getScriptProperties().getProperty('userPwd');
  
  var dbUrl = 'jdbc:mysql://' + address + '/' + db;  
  
  // Place relevant values found at Files -> Project Properties -> Script Properties
  // into local variables, and build / return a Jdbc connection object . . .
  
  return Jdbc.getConnection(dbUrl, user, userPwd);
}