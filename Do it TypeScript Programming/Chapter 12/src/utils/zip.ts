export const zip = (keys: string[], values: any[]) => {
  const makeObject = (key: string, value: any) => ({ [key]: value });
  const mergeObject = (a: any[]) => a.reduce((sum, val) => ({ ...sum, ...val }), {});

  const tmp = keys
    .map((key, index) => [key, values[index]])
    .filter((a) => a[0] && a[1])
    .map((a) => makeObject(a[0], a[1]));

  return mergeObject(tmp);
};
