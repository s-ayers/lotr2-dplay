import { Parser } from "binary-parser";
import { Pong } from "./Pong";
import { Ping } from ".//Ping";
import { DeletePlayer } from "./DeletePlayer";
import { EnumSessions } from "./EnumSessions";
import { EnumSessionsReply } from "./EnumSessionsReply";
import { RequestPlayerId } from "./RequestPlayerId";
import { RequestPlayerReply } from "./RequestPlayerReply";
import { CreatePlayer } from "./CreatePlayer";
import { SuperEnumPlayersReply } from "./SuperEnumPlayersReply";
import { AddForwardRequest } from "./AddForwardRequest";

const SockAddr = new Parser()
  .endianness("big")
  .uint16("family")
  .uint16("port")
  .uint32("ipv4")
  .seek(8);
//   .uint32("thing1")
//   .uint32("thing2");
const noneParse = new Parser();
export const Dplay = new Parser()
  .endianness("big")
  .uint8("size")
  .string("token", { encoding: "hex", length: 3 })
  .nest("SockAddr", { type: SockAddr })
  .string("action", { encoding: "hex", length: 4 })
  .uint16le("command")

  .string("dialect", { encoding: "hex", length: 2 })
  .choice("body", {
    tag: "command",
    choices: {
        0x01: EnumSessionsReply,
        0x02: EnumSessions,
        0x05: RequestPlayerId,
        0x07: RequestPlayerReply,
        0x08: CreatePlayer,
        0x0b: DeletePlayer,
        0x13: AddForwardRequest,
        0x16: Ping,
        0x17: Pong,

        0x29: SuperEnumPlayersReply,
    },
    defaultChoice: noneParse,
  });
