const { rejects } = require("assert");
const { resolve } = require("path");
var fs = require("fs");
async function read_data_from_file(path, report_path) {
  const lineReader = require("line-reader");

  try {
    lineReader.eachLine(path, function (line) {
      if (line.indexOf("TX") !== -1) {
        tx_values = line.split(":");
        if (tx_values[1].length > 3) {
          TxMessages.push(tx_values[1]);
        }
      } else if (line.indexOf("RX") !== -1) {
        rx_values = line.split(":");

        if (rx_values[1].length > 3) {
          RxMessages.push(rx_values[1]);
        }
      }
    });
  } catch (e) {
    console.error(e);
  }
  await new Promise((resolve, reject) => setTimeout(resolve, 1000));
  head="===="
  fs.appendFile(report_path, ("\n"+head.repeat(20)+"\n Number of Requests:"+TxMessages.length+
  "\n Number of Responses:"+RxMessages.length), function (err) {
    if (err) throw err;
  });
}

async function get_unique_slave_addresses(report_path) {
  if (RxMessages.length === 0) {
    return false;
  } else {
    for (index = 0; index < RxMessages.length; index++) {
      addresses = RxMessages[index].split(" ");
      if (!slave_addresses.includes(addresses[1])) {
        slave_addresses.push(addresses[1]);
      }
    }
  }
  await new Promise((resolve) => setTimeout(resolve, 1000));
}
async function extract_slave_info(report_path) {
  let Messages = TxMessages;
  // console.log(Messages)
  head="===="
  fs.appendFile(report_path, ("\n"+head.repeat(20)+"\n Request Information Per Slave: \n"), function (err) {
    if (err) throw err;
  });
  let device_info = [];
  globalThis.device_info_array = [];
  if (slave_addresses.length !== 0) {
    for (index = 0; index < slave_addresses.length; index++) {
      for (messages = 0; messages < Messages.length; messages++) {
        if (Messages[messages].includes(slave_addresses[index])) {
          splitted = Messages[messages].split(" ");
          let functionCode = parseInt(splitted[2], 16);
          let offset = parseInt(splitted[3] + splitted[4], 16);

          let numberofregisters = parseInt(splitted[5] + splitted[6], 16);
          device_info.push({
            functioncode: functionCode,
            offset: offset,
            numberofregisters: numberofregisters,
          });
          // console.log(splitted)
          Messages.splice(messages, 1);
          messages--;
        }
      }
      let devices = {
        INFO: device_info,
      };
      //   console.log(devices)
      device_info_array.push(devices);
      fs.appendFile(report_path, "\n SLAVE ADDRESS:"+
      [parseInt(slave_addresses[index], 16)]+"\n"
       +JSON.stringify(devices)+"\n", function (err) {
        if (err) throw err;
      });
    }
  }
  //   await new Promise((resolve, reject) => setTimeout(resolve, 1000));

  return device_info_array;
}
async function convert_slave_addresses_to_int(report_path) {
  for (index = 0; index < slave_addresses.length; index++) {
    slave_addresses_in_int.push(parseInt(slave_addresses[index], 16));
  }
  head="===="
  fs.appendFile(
    report_path,
   "\n"+ head.repeat(20) +
      "\n Slave Addresses: " +
      slave_addresses_in_int,
    function (err) {
      if (err) throw err;
      // console.log('Saved!');
    }
  );
}
async function main() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    
    report_filepath ="report-"+mm + '-' + dd + '-' + yyyy + '.txt';
    
    number=0
    while(fs.existsSync(report_filepath)){
        report_filepath="report-"+mm + '-' + dd + '-' + yyyy+'-'+number+ '.txt';
        number++;
    }
    


  globalThis.TxMessages = [];
  globalThis.RxMessages = [];
  globalThis.slave_addresses = [];
  globalThis.slave_addresses_in_int = [];
  globalThis.slave_info = [];
  await read_data_from_file("com_h_R1.log", report_filepath);
  await get_unique_slave_addresses(report_filepath);

  await convert_slave_addresses_to_int(report_filepath);
  await extract_slave_info(report_filepath);

  

}
main();
