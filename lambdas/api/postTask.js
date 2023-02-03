const Response = require("../common/Response");
const Dynamo = require("../common/Dynamo");
const { hooksWithBodyValidation } = require("../common/hooks");
const yup = require("yup");

const tableName = process.env.tableName;

const bodySchema = yup
  .object()
  .shape({
    ID: yup.string().required(),
    Title: yup
      .string()
      .required()
      .matches(/^[\w\s\d\#]+$/)
      .min(3)
      .max(30),
    Description: yup.string().required(),
    CreatedBy: yup.string().required(),
  })
  .noUnknown();

const handler = async (event) => {
  const task = event.body;
  task.Status = "Draft";
  task.DateCreated = new Date().toISOString();
  const newTask = await Dynamo.write(task, tableName);
  if (!newTask) {
    return Response._400({ message: "Failed to write Task" });
  }
  return Response._200({ message: "task created successfully" });
};

exports.handler = hooksWithBodyValidation({ bodySchema })(handler);
