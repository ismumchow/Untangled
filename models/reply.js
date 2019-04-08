
module.exports = function(sequelize, DataTypes) {
  var Reply = sequelize.define("Reply", {

    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      len: [1]
      //text allows an almost unlimited size
    },
    AuthorName: DataTypes.STRING,
    // AuthorFull: DataTypes.STRING,
  });

  Reply.associate = function(models) {
  
    Reply.belongsTo(models.Post, {
      foreignKey: {
        allowNull: false
      }
    }),
    Reply.belongsTo(models.Author, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Reply;
};
