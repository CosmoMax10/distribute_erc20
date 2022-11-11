export{readData, deleateData, onTransfer,};

require('dotenv').config();
const ethers = require("ethers");
const mysql = require("mysql");
const gldABI = require("../ABI/gld.json");

var connection = mysql.createConnection({

    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dip'

})

const gldAddress = process.env.GLD_ADDRESS;
const provider = new ethers.providers.WebSocketProvider(
    process.env.WEBSOCKET_PROVIDER
);

const contract = new ethers.Contract(gldAddress, gldABI, provider);




// DB functions
// getting all data from table
function readData() {
    connection.query('SELECT * FROM holder_address_and_balance', function(error :any, response :any){
        if(error) throw error;
        console.log(response);
        console.log(response[0].id);
    })
}


// deleting all data in table
function deleateData() {
    connection.query('delete from holder_address_and_balance', function(error : any, response : any){
        if(error) throw error;
        console.log(response);
    })
}


// finding data with a specific id
function searchData(id : number){
    connection.query('select * from holder_address_and_balance where id = ?', id,
    function(error : any, response : any){
        if(error) throw error;
        console.log(response);
    })
}

function searchAndUpdateData(id :number, value : number){
    connection.query('update holder_address_and_balance set balance = balance + ? where id = ?', [value, id],
    function(error : any, response : any){
        if(error) throw error;
        console.log(response);
    })
}


// Inserting data to DB
function addAddress(address : any, value : any){
    connection.query('insert into holder_address_and_balance set ?', {
        address: address,
        balance: value
    },
    function(error : any, response : any){
        if(error) throw error;

        console.log(response);
        console.log("added new address");
    })
}


// updates reciever balance.
// if reciever address not found, insert new data to DB.
function updateReciever(address : any, value : any){
    connection.query('update holder_address_and_balance set balance = balance + ? where address = ?',[value, address],
    function(error : any, response : any){
        if(error) throw error;
        console.log(response);

        if(response.affectedRows == 0){
            console.log("no matching address");
            addAddress(address, value);
        }
        else{
            console.log("successfully added value to balance.")
            console.log("added value to " + address);
        }
    })

}


// updates sender balance.
function updateSender(address : any, value : any){
    connection.query('update holder_address_and_balance set balance = balance - ? where address = ?',[value, address],
    function(error : any, response : any){
        if(error) throw error;
        console.log(response);

        if(response.affectedRows == 0){
            console.log("no matching address, must be a bug.");
        }
        else{
            console.log("successfully subtracted value from balance.")
        }
    })

}


// detects the transfer event and update sender and reciever
async function onTransfer() {
    
    await contract.on("Transfer", (from : any, to : any, value : any, event : any) => {
        var info = {
            from: from,
            to: to,
            value: ethers.utils.formatUnits(value, 18),
            data: event,
        };

        //Add functions here
        
        updateSender(info.from, info.value);
        console.log("updated sender");

        updateReciever(info.to, info.value);
        console.log("updated reciever");
    })
}

