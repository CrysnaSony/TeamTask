const AWS = require("aws-sdk");

const documentClient = new AWS.DynamoDB.DocumentClient();

const Dynamo = {
  async get(ID, TableName) {
    const params = {
      TableName,
      Key: {
        ID,
      },
    };
    const data = await documentClient.get(params).promise();
    if (!data || !data.Item) {
      throw Error(`Error fetching task by ID: ${ID}`);
    }
    console.log(data);
    return data.Item;
  },
  async write(data, TableName) {
    // if (!data.ID) {
    //   throw Error("ID required");
    // }
    const params = {
      TableName,
      Item: data,
      ConditionExpression: "attribute_not_exists(ID)",
    };
    const res = await documentClient.put(params).promise();
    if (!res)
      throw Error(
        `Error writing task with ID ${data.ID} into table: ${TableName}`
      );
    return data;
  },
  async update({ tableName, primaryKey, primarykeyValue, Item }) {
    const itemKeys = Object.keys(Item);

    const params = {
      TableName: tableName,
      Key: {
        [primaryKey]: primarykeyValue,
      },
      ConditionExpression: `attribute_exists(${primaryKey}) AND attribute_not_exists(DateClosed)`,
      UpdateExpression: `SET ${itemKeys
        .map((k, index) => `#field${index} = :updateValue${index}`)
        .join(", ")}`,
      ExpressionAttributeNames: itemKeys.reduce(
        (accumulator, k, index) => ({ ...accumulator, [`#field${index}`]: k }),
        {}
      ),
      ExpressionAttributeValues: itemKeys.reduce(
        (accumulator, k, index) => ({
          ...accumulator,
          [`:updateValue${index}`]: Item[k],
        }),
        {}
      ),
      ReturnValues: "UPDATED_NEW",
    };
    // return params;
    return documentClient.update(params).promise();
    // return res;
  },
  async scan(AssignedTo, TableName) {
    const params = {
      TableName,
      FilterExpression: "AssignedTo = :AssignedTo",
      ExpressionAttributeValues: { ":AssignedTo": AssignedTo },
    };
    const data = await documentClient.scan(params).promise();
    if (!data || !data.Items)
      throw Error(`Error Fetching task for member ${AssignedTo}`);
    return data.Items;
  },
  async delete(ID, TableName) {
    const params = {
      TableName,
      Key: {
        ID,
      },
    };
    return documentClient.delete(params).promise();
  },
};

module.exports = Dynamo;
