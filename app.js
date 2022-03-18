const { rejects } = require('assert');
const { resolve } = require('path');

async function read_data_from_file(){
    
    const lineReader = require('line-reader');
    
        try{
             lineReader.eachLine('com_h_R1.log', function(line) {
               
               if (line.indexOf("TX")!== -1){
                   tx_values=line.split(":")
                   TxMessages.push(tx_values[1])
               }
               else if (line.indexOf("RX")!== -1){
                   rx_values=line.split(":")
                   RxMessages.push(rx_values[1])
                   
            
               }
               
           });
           
       } catch(e){
           console.error(e)
       }
       await new Promise((resolve, reject)=>setTimeout(resolve, 1000))
   
}

async function get_unique_slave_addresses(){
    if(RxMessages.length===0){
        return false
    }
    else {
        for (index=0;index<RxMessages.length;index++){
            addresses=RxMessages[index].split(" ")
            if(!slave_addresses.includes(addresses[1]) ){
                slave_addresses.push(addresses[1])
            }
        }
        
    }
    await new Promise((resolve)=>setTimeout(resolve, 1000))
}
async function extract_slave_info(){
    let Messages=TxMessages
    // console.log(Messages)
if (slave_addresses.length!==0){
    for (index=0;index<slave_addresses.length; index++){
        for(messages=0;messages<Messages.length;messages){
            if(Messages[messages].includes(slave_addresses[index])){
                splitted=Messages[messages].split(" ")
                console.log(splitted)
Messages.splice(messages,1);
messages--;
            }
        }
    }
}

}
async function main(){
    globalThis.TxMessages=[];
    globalThis.RxMessages=[];
    globalThis.slave_addresses=[]
    globalThis.slave_info=[]
    await read_data_from_file();
    await get_unique_slave_addresses();
    await extract_slave_info()
    console.log("This is the list of unique slave devices:", slave_addresses);
}
main();