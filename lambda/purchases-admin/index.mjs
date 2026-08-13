// Admin API: list recorded purchases. Protected by ADMIN_KEY (x-admin-key
// header or ?key= query param). Consumed by /admin/purchases on the site.
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const TABLE     = process.env.TABLE || "paibots-purchases";
const ADMIN_KEY = process.env.ADMIN_KEY;
const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN || "*";

const corsHeaders = {
  "Access-Control-Allow-Origin":  ALLOW_ORIGIN,
  "Access-Control-Allow-Methods": "GET,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,x-admin-key",
  "Content-Type":                 "application/json",
};

const respond = (status, body) => ({
  statusCode: status,
  headers: corsHeaders,
  body: JSON.stringify(body),
});

export const handler = async (event) => {
  const method = event.requestContext?.http?.method || event.httpMethod;
  if (method === "OPTIONS") return respond(204, {});

  const key = event.headers?.["x-admin-key"] || event.queryStringParameters?.key || "";
  if (!ADMIN_KEY || key !== ADMIN_KEY) return respond(401, { ok: false, error: "Unauthorized" });

  const items = [];
  let lastKey;
  do {
    const page = await ddb.send(new ScanCommand({ TableName: TABLE, ExclusiveStartKey: lastKey }));
    items.push(...(page.Items || []));
    lastKey = page.LastEvaluatedKey;
  } while (lastKey);

  items.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  return respond(200, { ok: true, count: items.length, purchases: items });
};
