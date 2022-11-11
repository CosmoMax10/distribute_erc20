//importing necessary functions
import {readData, deleateData, onTransfer} from "./get_GLD_account";
import { distribute_with_DB } from "./distribute";
import { on_USDT_Transfer } from "./get_USDT_account";

// use readData() to see all data in DB.
// use onTransfer to get records of FT holders.
// use distribute_with_DB to distribute FT to holders.

// use on_USDT_transfer to see how it looks like with many transactions.


// readData();

// onTransfer();

// distribute_with_DB(100);

// on_USDT_transfer();

distribute_with_DB(100);