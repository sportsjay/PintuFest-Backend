"use strict";
module.exports = (sequelize, DataTypes) => {
  const Test = sequelize.define(
    "Test",
    {
      // Model attributes are defined here
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "Test",
    }
  );
  console.log("Test table model");
  return Test;
};
