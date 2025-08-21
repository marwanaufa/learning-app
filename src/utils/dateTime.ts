export const dateNow = () => {
  let localTime: Date = new Date();
  let offset: number = localTime.getTimezoneOffset();
  let serverTime: string = new Date(
    localTime.getTime() - offset * 60000
  ).toISOString();
  return serverTime;
};
