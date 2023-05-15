import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getTodosBySearch } from '../../businessLogic/todos'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Search a TODO items with the provided query string in the "searchTodo" object
    const userId = getUserId(event);
    const query = JSON.parse(event.body)?.search //event.queryStringParameters?.q;

    if (!query) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Missing query parameter",
        }),
      };
    }

    try {
      const items = await getTodosBySearch(userId, query);
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          items,
        }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Internal server error",
        }),
      };
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
