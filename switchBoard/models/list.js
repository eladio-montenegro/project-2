module.exports = function(sequelize, DataTypes) {
  var List = sequelize.define("List", {
    // Giving the Author model a name of type STRING
    list: DataTypes.STRING
  });
  List.associate = function(models) {
    // Associating List with Todos
    // When an List is deleted, also delete any associated Todos
    List.hasMany(models.Todo, {
      onDelete: "cascade"
    });
 };
  return List;
};