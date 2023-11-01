print("Started adding the users.");
db = db.getSiblingDB("animals");
db.createUser({
  user: "my-api-user",
  pwd: "478Hh95GU95aHaEnsaKQ",
  roles: [{ role: "readWrite", db: "animals" }],
});
print("End adding the user roles.");