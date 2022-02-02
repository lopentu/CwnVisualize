export const chunkString = (string, length) =>
  string?.match(new RegExp(`.{1,${length}}`, "g"))?.join("\r\n");
