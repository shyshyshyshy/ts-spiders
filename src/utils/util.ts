interface Result {
  success: boolean;
  errMsg?: string;
  data: any;
}

export const getResponeseData = (data: any, errMsg?: string): Result => {
  if (errMsg) {
    return {
      success: false,
      errMsg,
      data
    };
  }
  return {
    success: true,
    data
  };
};
