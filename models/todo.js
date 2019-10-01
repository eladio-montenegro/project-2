module.exports = function (sequelize, DataTypes) {
 var Todo = sequelize.define("Todo", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
  });
  Todo.associate = function (models) {
    // We're saying that a List should belong to an Author
    // A List can't be created without an Author due to the foreign key constraint
    Todo.belongsTo(models.List, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Todo;
};
