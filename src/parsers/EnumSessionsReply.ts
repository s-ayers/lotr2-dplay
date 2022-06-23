import { Parser } from "binary-parser";

export const EnumSessionsReply = new Parser()
  .endianness("little")
  .uint32("length")
  .uint32("flags")
  .buffer("instance", { length: 16 })
  .buffer("guid", { length: 16 })
  .uint32("maxPlayers")
  .uint32("currentPlayers")
  .uint32("namePointer")
  .uint32("passwordPointer")
  .uint32("reserved1")
  .uint32("reserved2")
  .uint32("user1")
  .uint32("user2")
  .uint32("user3")
  .uint32("user4")
  .uint32("nameOffset")
  .string("name", { zeroTerminated: true });