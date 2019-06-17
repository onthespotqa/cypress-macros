import { format } from "date-fns";

import { variables } from "../../src";

variables.add("$today", () => {
  const now = new Date();
  return {
    short: format(now, "M/D/YY"),
    long: format(now, "MM/DD/YYYY"),
    year: format(now, "YYYY")
  };
});

variables.add("$villains", () => ({
  major: ["Faustus", "Mandarin", "Joker"],
  minor: []
}));
