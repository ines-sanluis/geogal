function getHints(start: string, end: string, solutions: string[]) {
  // Remove start and end from solutions
  const restOfSolutions = solutions.filter((s) => s !== start && s !== end);
  const pathLength = restOfSolutions.length;
  const isPlural = pathLength > 1;

  return [
    {
      text: `A ruta pasa por ${pathLength} concello${isPlural ? "s" : ""}`,
    },
    {
      text: isPlural
        ? `Un dos concellos comeza coa letra "${restOfSolutions[0].charAt(0)}"`
        : `O concello comeza coa letra "${restOfSolutions[0].charAt(0)}"`,
    },
    {
      text: isPlural
        ? `Outros dos concellos comeza coa letra "${restOfSolutions[1].charAt(
            0
          )}"`
        : `A seguinte letra é "${restOfSolutions[0].charAt(1)}"`,
    },
  ];
}

export default getHints;
