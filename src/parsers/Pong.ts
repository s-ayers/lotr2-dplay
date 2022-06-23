import { Parser } from "binary-parser";

export const Pong = new Parser()
  .endianness("big")
  .string("from", {encoding: "hex", length: 4})
  .uint32le("tick");
