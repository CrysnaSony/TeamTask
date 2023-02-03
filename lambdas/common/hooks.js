const {
  useHooks,
  logEvent,
  parseEvent,
  handleUnexpectedError,
} = require("lambda-hooks");

const withHooks = useHooks({
  before: [logEvent, parseEvent],
  after: [],
  onError: [handleUnexpectedError],
});
const hooksWithBothValidation = ({ bodySchema, pathSchema }) => {
  return useHooks(
    {
      before: [logEvent, parseEvent, validateEventBody, validatePaths],
      after: [],
      onError: [handleUnexpectedError],
    },
    {
      bodySchema,
      pathSchema,
    }
  );
};
const hooksWithBodyValidation = ({ bodySchema }) => {
  return useHooks(
    {
      before: [logEvent, parseEvent, validateEventBody],
      after: [],
      onError: [handleUnexpectedError],
    },
    {
      bodySchema,
    }
  );
};
const hooksWithPathValidation = ({ pathSchema }) => {
  return useHooks(
    {
      before: [logEvent, parseEvent, validatePaths],
      after: [],
      onError: [handleUnexpectedError],
    },
    {
      pathSchema,
    }
  );
};
module.exports = {
  withHooks,
  hooksWithBothValidation,
  hooksWithBodyValidation,
  hooksWithPathValidation,
};

const validateEventBody = async (state) => {
  const { bodySchema } = state.config;
  if (!bodySchema) throw Error("missing body schema");
  try {
    const { event } = state;
    await bodySchema.validate(event.body, { strict: true, stripUnknown: true });
  } catch (err) {
    console.log("yup validation error of event.body", err);
    state.exit = true;
    state.response = {
      statusCode: 400,
      body: JSON.stringify({ error: err.message }),
    };
  }

  return state;
};

const validatePaths = async (state) => {
  const { pathSchema } = state.config;
  if (!pathSchema) throw Error("missing path schema");
  try {
    const { event } = state;
    await pathSchema.validate(event.pathParameters, { strict: true });
  } catch (err) {
    console.log("yup validation error of event.pathParameters", err);
    state.exit = true;
    state.response = {
      statusCode: 400,
      body: JSON.stringify({ error: err.message }),
    };
  }

  return state;
};
