import { NextResponse } from 'next/server';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function successResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(
    { success: true, data },
    { status }
  );
}

export function errorResponse(error: unknown, defaultStatus: number = 500) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    if (error.message.startsWith('Forbidden')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: defaultStatus }
    );
  }

  return NextResponse.json(
    { success: false, error: 'Internal server error' },
    { status: defaultStatus }
  );
}

export function notFoundResponse(message: string = 'Resource not found') {
  return NextResponse.json(
    { success: false, error: message },
    { status: 404 }
  );
}

export function validationErrorResponse(message: string) {
  return NextResponse.json(
    { success: false, error: message },
    { status: 400 }
  );
}
