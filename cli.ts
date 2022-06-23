import { Dplay } from "./src/parsers/Dplay";

import * as chalk from "chalk";

const log = console.log;

const PCAPNGParser = require("pcap-ng-parser");
const EtherFrame = require("ether-frame");
const bp = require("binary-parser");

const pcapNgParser = new PCAPNGParser();
const myFileStream = require("fs").createReadStream("./chat.pcapng");

const tcpHeader = new bp.Parser()
  .namely("tcp")
  .endianness("big")
  .uint16("srcPort")
  .uint16("dstPort")
  .uint32("seq")
  .uint32("ack")
  .bit4("dataOffset")
  .bit6("reserved")
  .nest("flags", {
    type: new bp.Parser()
      .bit1("urg")
      .bit1("ack")
      .bit1("psh")
      .bit1("rst")
      .bit1("syn")
      .bit1("fin"),
  })
  .uint16("windowSize")
  .uint16("checksum")
  .uint16("urgentPointer");

const udpHeader = new bp.Parser()
  .namely("udp")
  .endianness("big")
  .uint16("srcPort")
  .uint16("dstPort")
  .uint16("length")
  .uint16("chksum");

const ipHeader = new bp.Parser()
  .endianness("big")
  .bit4("version")
  .bit4("headerLength")
  .uint8("tos")
  .uint16("packetLength")
  .uint16("id")
  .bit3("offset")
  .bit13("fragOffset")
  .uint8("ttl")
  .uint8("protocol")
  .uint16("checksum")
  .array("src", {
    type: "uint8",
    length: 4,
  })
  .array("dst", {
    type: "uint8",
    length: 4,
  })
  .choice("tcpudp", {
    tag: "protocol",
    choices: {
      6: tcpHeader, // if tagValue == 1, execute parser1
      17: udpHeader, // if tagValue == 4, execute parser2
    },
  })
  .saveOffset("Dplay");

const stats = {};
const zeroStats = {};

let server;
const clients = [];

let i = 0;
let ddata;
myFileStream
  .pipe(pcapNgParser)
  .on("data", (parsedPacket) => {
    var ip;
    try {
      var ether = EtherFrame.fromBuffer(
        parsedPacket.data,
        pcapNgParser.endianess
      );

      var data = parsedPacket.data.slice(ether.length);
      // log(ether, data);
      ip = ipHeader.parse(data);
      if (ip.packetLength > ip.Dplay) {
        // log(ip);
        ddata = data.slice(ip.Dplay);
        // log(ddata);
        const dplay = Dplay.parse(ddata);
        if (stats[dplay.command]) {
          stats[dplay.command] += 1;
        } else {
          stats[dplay.command] = 1;
        }

        if (dplay.command === 0x01  ) {
          log(
            "[%s] %s%s [%s] %s",
            ip.dst,
            chalk.green("<"),
            chalk.blue("================================="),
            ip.src,
            chalk.green("EnumSessionsReply")
          );
          // log(ip);
          // log(dplay);
        }

        if (dplay.command === 0x00 || dplay.command === 0x07) {
          const customData = ddata.slice(28);

          const cmd = customData.readUInt16LE();

          if (cmd === 0x4506) {
            // log(customData);
            log(dplay);
            // log(cmd.toString(16));
            const msg = customData.slice(8, 30).toString();
            // log(i);
            log(customData.slice(0, 8));
            log(
              "[%s] %s%s [%s] %s",
              ip.dst,
              chalk.green("<"),
              chalk.blue("================================="),
              ip.src,
              chalk.green(msg)
            );
          }

          if (zeroStats[cmd]) {
            zeroStats[cmd] += 1;
          } else {
            zeroStats[cmd] = 1;
          }

          // if (i < 30) {
          //   log(cmd);
          // }
          if (cmd === 11265) {
            // log(dplay);
            // log(customData);
          }
        }

        // log(stats);
        // log(zeroStats);
        ddata = null;
        i += 1;
      }
    } catch (ex) {
      // Catches for type codes not currently supported by ether-frame
      // log(ex)
      // log(ip, ddata);
      ddata = null;
    }
  })
  .on("interface", (interfaceInfo) => {
    // log(interfaceInfo)
  });

myFileStream.on("finish", () => {
  log(stats);
});
