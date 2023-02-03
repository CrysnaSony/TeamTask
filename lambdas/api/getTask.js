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

  const task = await Dynamo.get(ID, tableName);

  if (!task) return Response._400({ message: "Failed to get task by ID" });

  return Response._200(task);
};
exports.handler = hooksWithPathValidation({ pathSchema })(handler);
