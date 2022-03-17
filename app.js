const { rejects } = require('assert');
const { resolve } = require('path');
function split_string(information){
    return information.split(" ")
}
function extract_device_address(info_arr){
    
    return info_arr[1]
}
function extract_function_code(info_arr){
    
    return info_arr[2]
}
function extract_number_of_bytes_further(information){
    
    return info_arr[3]
}
async function read_data_from_file(){
    var jsondata=[];
    
    const lineReader = require('line-reader');
    
        try{
             lineReader.eachLine('com_h_R1.log', function(line) {
               // console.log(line.indexOf("TX"));
               // console.log(typeof line)
               // components=line.split(" ")
               // console.log(components)
               if (line.indexOf("TX")!== -1){
                   tx_values=line.split(":")
                   splited=split_string(tx_values[1]);
                let Tx={TX:{DeviceType:"Master" ,
                DeviceId:extract_device_address(splited),
             Function_code:extract_function_code(splited),
            }}
            jsondata.push(Tx)      
            
               }
               else if (line.indexOf("RX")!== -1){
                   rx_values=line.split(":")
                   
                   splited=split_string(rx_values[1]);
                let Rx={RX:{DeviceType:"Slave" ,
                DeviceId:extract_device_address(splited),
             Function_code:extract_function_code(splited),
            }}
                  jsondata.push(Rx)
                   // console.log(rx_array)
               }
               else{
                   // console.log("characters not found")
               }
               
           });
           
       } catch(e){
           console.error(e)
       }
       await new Promise((resolve, reject)=>setTimeout(resolve, 1000))
      
    

    // console.log(tx_array)
    return jsondata;
}
async function process_data(){
    data=await read_data_from_file();
    myRf=data["TX"]
    data=JSON.stringify(data)
    data=JSON.parse(data)
    unique_slaves=[];
    unique_master=[];
    
  
    
    // console.log("This is the tx arrays 1:", data);
    
}
process_data()

// var msg = 'Hello World';
// console.log(msg);


