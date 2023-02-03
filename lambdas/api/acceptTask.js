const Response = require("../common/Response");
const Dynamo = require("../common/Dynamo");
const { hooksWithPathValidation } = require("../common/hooks");
const yup = require("yup");

const tableName = process.env.tableName;

const pathSchema = yup.object().shape({
  ID: yup.string().required(),
});

const handler = async (event) => {
  let ID = event.pathParameters.ID;
  const update = {
    Status: "In-Progress",
  };
  const task = await Dynamo.update({
    tableName,
    primaryKey: "ID",
    primarykeyValue: ID,
    Item: update,
  });
  if (!task) {
    return Response._400({
      message: "Failed to update task",
    });
  }
  return Response._200(task);
};
exports.handler = hooksWithPathValidation({ pathSchema })(handler);
