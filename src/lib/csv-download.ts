/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
const convertToCSV = (data: any) => {
  const array = [Object.keys(data[0])].concat(data);
  return array
    .map((row) => {
      return Object.values(row)
        .map((value) => {
          return typeof value === "string" ? `${value.replace(/"/g, '""')}` : value;
        })
        .join(",");
    })
    .join("\n");
};

export const downloadCSV = (data: any, filename = "data") => {
  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename + ".csv");
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
