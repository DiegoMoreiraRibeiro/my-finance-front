export function maskDate(value) {
  let v = value.replace(/\D/g, "").slice(0, 10);
  if (v.length >= 5) {
    return `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`;
  } else if (v.length >= 3) {
    return `${v.slice(0, 2)}/${v.slice(2)}`;
  }
  return v;
}

const zeroPad = (num, places) => String(num).padStart(places, "0");

export function getDateYYYYmmdd() {
  const date = new Date();
  const month = zeroPad(date.getMonth() + 1, 2);
  const day = zeroPad(date.getDate(), 2);
  return date.getFullYear() + "-" + month + "-" + day;
}

export function convertDateYYYYmmdd(dt: string) {
  const date = new Date(dt);
  const month = zeroPad(date.getMonth() + 1, 2);
  const day = zeroPad(date.getDate(), 2);
  return date.getFullYear() + "-" + month + "-" + day;
}

export function covertDateYYYYmmdd(dateParam: Date | string) {
  let date_;
  if (typeof dateParam == "string") {
    date_ = new Date(
      dateParam.split("/")[2] +
        "-" +
        dateParam.split("/")[1] +
        "-" +
        dateParam.split("/")[0]
    );
  } else {
    date_ = dateParam;
  }
  const month = zeroPad(date_.getMonth() + 1, 2);
  const day = zeroPad(date_.getDate(), 2);
  return date_.getFullYear() + "-" + month + "-" + day;
}
