const Response = require("../common/Response");
const Dynamo = require("../common/Dynamo");
const { hooksWithPathValidation } = require("../common/hooks");
const yup = require("yup");

const tableName = process.env.tableName;

const pathSchema = yup.object().shape({
  AssignedTo: yup.string().required(),
});

const handler = async (event) => {
  let AssignedTo = event.pathParameters.AssignedTo;
  const task = await Dynamo.scan(AssignedTo, tableName);
  if (!task) {
    return Response._400({
      message: "Failed to get task",
    });
  }
  return Response._200(task);
};
exports.handler = hooksWithPathValidation({ pathSchema })(handler);
