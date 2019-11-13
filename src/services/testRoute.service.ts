import httpStatusCodes from 'http-status-codes';

export const testService = async (): Promise<{
  status: number;
  body: string;
  error?: string;
}> => {
  return {
    status: httpStatusCodes.OK,
    body: 'Test is OK'
  };
};
