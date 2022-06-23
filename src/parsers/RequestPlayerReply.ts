import { Parser } from "binary-parser";

export const RequestPlayerReply = new Parser()
  .endianness("little")
  .uint32("playerId")
;