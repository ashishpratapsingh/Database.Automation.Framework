export async function expectDatabaseError(
  action: () => Promise<any>,
  expectedErrorCode: string
) {
  try {
    await action();
    fail("Expected a database error to be thrown, but the operation succeeded.");
  } catch (error: any) {
    // Check for standard SQL error codes (e.g., '23505' for Postgres unique violation)
    expect(error.code).toBe(expectedErrorCode);
  }
}