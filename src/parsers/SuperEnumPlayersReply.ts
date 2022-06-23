import { Parser } from "binary-parser";

export const SuperEnumPlayersReply = new Parser()
  .endianness("little")
  .uint32("playerCount")
  .uint32("groupCount")
  .uint32("packOffset")
  .uint32("shortcutCount")
  .uint32("descriptionOffset")
  .uint32("nameOffset")
  .uint32("passwordOffset")
  .uint32("descriptionLength")
  .uint32("flags")
  .buffer("instance", {length: 16})
  .buffer("game", {length: 16})
  .uint32("maxPlayers")
  .uint32("currentPlayers")
  ;