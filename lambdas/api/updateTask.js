const Response = require("../common/Response");
const Dynamo = require("../common/Dynamo");
const { hooksWithBothValidation } = require("../common/hooks");
const yup = require("yup");

const tableName = process.env.tableName;

const bodySchema = yup
  .object()
  .shape({
    Title: yup.string(),
    Description: yup.string(),
    CreatedBy: yup.string(),
  })
  .noUnknown();
const pathSchema = yup.object().shape({
  ID: yup.string().required(),
});

const handler = async (event) => {
  let ID = event.pathParameters.ID;
  const updatedTask = event.body;
  const task = await Dynamo.update({
    tableName,
    primaryKey: "ID",
    primarykeyValue: ID,
    Item: updatedTask,
  });
  if (!task) {
    return Response._400({ message: "Failed to update task: " });
  }
  return Response._200(task);
};

exports.handler = hooksWithBothValidation({ bodySchema, pathSchema })(handler);
