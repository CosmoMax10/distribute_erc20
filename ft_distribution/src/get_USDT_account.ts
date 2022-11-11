export{on_USDT_Transfer};

const ethers = require("ethers");
const mysql = require("mysql");
const usdtABI = require("../ABI/usdt.json");

var connection = mysql.createConnection({

    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dip'

})

const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const provider = new ethers.providers.WebSocketProvider(
        'wss://eth-mainnet.g.alchemy.com/v2/YPoGb8qxbR5a88ytabPykg2V0an-F4bG'
    );

const contract = new ethers.Contract(usdtAddress, usdtABI, provider);



// easy functions to see that the DB is working
function readData() {
    connection.query('SELECT * FROM holder_address_and_balance', function(error :any, response :any){
        if(error) throw error;
        console.log(response);
        console.log(response[0].id);
    })
}




function deleateData() {
    connection.query('delete from holder_address_and_balance', function(error : any, response : any){
        if(error) throw error;
        console.log(response);
    })
}


function searchAndUpdateData(){
    connection.query('update holder_address_and_balance set balance = balance + 777 where id = 95',
    function(error : any, response : any){
        if(error) throw error;
        console.log(response);
    })
}


function searchData(){
    connection.query('select * from holder_address_and_balance where id = 93',
    function(error : any, response : any){
        if(error) throw error;
        console.log(response);
    })
}






// Adding address with transaction value to use in Main()
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


// search for address in DB and add value to balance
// if not found, add new address with value
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




// detects the transfer event
async function on_USDT_Transfer() {
    
    await contract.on("Transfer", (from : any, to : any, value : any, event : any) => {
        var info = {
            from: from,
            to: to,
            value: ethers.utils.formatUnits(value, 6),
            data: event,
        };

        //Add functions here
        
        updateSender(info.from, info.value);
        console.log("updated sender");

        updateReciever(info.to, info.value);
        console.log("updated reciever");
    })
}
