import { Parser } from "binary-parser";

export const RequestPlayerId = new Parser()
  .endianness("little")
  .bit1("system")
  .bit1("name")
  .bit1("local")
  .bit1("unknown1")
  .uint8("reserved")
  .bit1("unknown2")
  .bit1("secure")
  ;
