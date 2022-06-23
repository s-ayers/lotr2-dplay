import { Parser } from "binary-parser";

export const DeletePlayer = new Parser()
  .endianness("big")
  .uint32("to")
  .uint32("player")
  .uint32("group")
  .uint32("offsetPackedPlayer")
  .uint32("offsetPassword")
  ;
