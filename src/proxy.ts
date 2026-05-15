import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import { token_decoder } from './services/token.service';
import { IUser, User } from './db/schemas/user.schema';
import { UnauthorizedError } from './util/customErrors';
import { ApiResponse } from './util/ApiResponse';
import { dbConnect } from './db';

export interface AuthenticatedRequest extends NextRequest {
  user: Partial<IUser>;
}

export async function proxy(request: AuthenticatedRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value || "";

    const payload = await token_decoder(accessToken);
    await dbConnect();
    const user_from_db = await User.findOne({ username: payload.username });
    if (!user_from_db.username) {
      throw new UnauthorizedError();
    }
    // console.log("meow", user_from_db);

    const requestHeaders = new Headers(request.headers);

    requestHeaders.set('x-user-username', user_from_db.username);
    requestHeaders.set('x-user-email', user_from_db.email);

    return NextResponse.next({
      request: {
        headers: requestHeaders
      }
    });
  } catch (e) {
    const resp: ApiResponse<null> = {
      status: false,
      status_code: 403,
      message: (e as unknown as Error).message || "unauthorized",
      data: null
    };
    return Response.json(resp, { status: 403 });
  }

}

export const config = {
  matcher: [
    "/api/expense/:path*",
    "/api/admin/:path*"
  ]
}