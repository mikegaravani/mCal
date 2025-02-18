const blueColor = "#007bff";
const greenColor = "#28a745";

export function finitePomodoroCreator(focus, relax, cycles) {
  let finalArray = [];
  for (let i = 0; i < cycles; i++) {
    finalArray.push({
      time: `${focus} min`,
      description: "FOCUS",
      color: blueColor,
    });
    if (i < cycles - 1) {
      finalArray.push({
        time: `${relax} min`,
        description: "RELAX",
        color: greenColor,
      });
    }
  }
  return finalArray;
}
