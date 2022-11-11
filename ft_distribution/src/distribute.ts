
export {distribute_with_DB};
require('dotenv').config();

const ethers = require('ethers'); 

const GLD_address = process.env.GLD_ADDRESS;
const GLD_ABI = require('../ABI/gld.json');

const reciever_address = "0xE4e75dAd73a9Ee498b01094a30Ea6eBF921d2c36";

const provider = new ethers.providers.WebSocketProvider(
    'wss://eth-goerli.g.alchemy.com/v2/SRfTDCS_gGP1Ii4L4WRkkxRBooibYwgL'
);

const privateKey = process.env.SIGNER_PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(GLD_address, GLD_ABI, wallet);

var numberOfDecimals = 18;
var numberOfTokens = ethers.utils.parseUnits('1', numberOfDecimals);

//DB settings
const mysql = require("mysql");
var connection = mysql.createConnection({

    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dip'

})


// sending ERC20 to desired address
const sendGLD = async (address : any,) => {

    await contract.transfer(address, numberOfTokens).then(function(tx : any){
        console.log(tx);
    });

}


//sending ERC20 to desired address with fixed ratio
const sendGLDwithRatio = async (address : any, number:any, ratio : any) => {

    var value = number * ratio;

    await contract.transfer(address, 
        ethers.utils.parseUnits((number * ratio).toString(), numberOfDecimals)) 
        .then(function(tx : any){
        console.log(tx);
    });

    updateReciever(address, value);

}


// sending ERC20 to multiple addresses
const distributeGLD = async (list : any) => {

    for (var i = 0; i<list.length; i++) {
        console.log("sending to" +  list[i].address);
        await sendGLD(list[i].address);
        console.log("sended!");
    }

}


// sending ERC20 to multiple addresses with fixed ratio
const distributeGLDwithRatio = async (list : any, number : any) => {

    for (var i = 0; i<list.length; i++) {
        // sendGLD(list[i]);
        console.log("sending to " +  list[i].address);
        await sendGLDwithRatio(list[i].address, number, list[i].ratio);
        console.log("sended!");
    }
}


// calculate the FT holding ratio for each address
const getRatio = (list : any) => {

    var distribute_data = [];

    var sumBalance = 0;
    for (var i = 0; i<list.length; i++) {
        sumBalance += list[i].balance;
    }

    console.log("sum of balance is " + sumBalance.toString());
    for (var i = 0; i<list.length; i++) {
        var info = {
            address: list[i].address,
            ratio: (list[i].balance / sumBalance).toPrecision(3)
        }

        distribute_data.push(info);

    }

    console.log(distribute_data);
    return distribute_data;
}


//distributeした後のDBのupdate
function updateReciever(address : any, value : any){
    connection.query('update holder_address_and_balance set balance = balance + ? where address = ?',[value, address],
    function(error : any, response : any){
        if(error) throw error;
        console.log(response);

        console.log("successfully added value to balance.")
        console.log("added value to " + address);
        
    })

}


// prints ratios for each address.
const testRatio = () => {

    connection.query('SELECT * FROM holder_address_and_balance', function(error :any, response :any){
        if(error) throw error;
        console.log(response);

        getRatio(response);
    })
};


// distributes the distribute_amount FTs to holders with fixed ratio. It is also the main function of this script.
function distribute_with_DB(distribute_amount : any) {
    connection.query('SELECT * FROM holder_address_and_balance', function(error :any, response :any){
        if(error) throw error;
        console.log(response);
        
        console.log(response.length);

        var number = 0;
        var list = getRatio(response);

        number = distribute_amount;
        distributeGLDwithRatio(list, number);
    })
}

