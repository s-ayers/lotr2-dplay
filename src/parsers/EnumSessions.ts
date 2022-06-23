import { Parser } from "binary-parser";

export const EnumSessions = new Parser()
  .endianness("big")
  .buffer("guid", {length:16})
  .uint32("passwordOffset")
  .nest("flags", {
    type: new Parser()
    .endianness("little")

    .bit1("joinable")
    .bit1("all")
    .bit6("paasword")
    ,
  })
  ;
