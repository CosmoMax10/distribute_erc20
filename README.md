# token_distributing_model

## Code Explanation
### What it does
This project have two main features.
1. Manages DB composed with a specific FT holders.
2. Distributes FT to those holders with fixed ratio.

### scripts explanation

* all of the important functions are in index.ts. You can use them by running the comand, 
```
npm run dev
```

## How to get started

* clone the repository
* get the .env file ready with your wallet private key.
* get your local DB ready. I used mySQL.


# Notes

* I used GLD, which is a ERC20 I made for just testing, so we can use DIP in the future instead.
* I used mysql for the database but we can use gcp or anything instead.
* you can test the getting accounts function with usdt instead using get_account.ts.
* I will make the code easier to read soon.

# Concerns

* I might should have used an API to distribute tokens. I think there are easier, faster ways in the world.
* I had a bug when testing with usdt due to synchronization of recieving transfer events. I need to fix this later when DIP gets big.   

# Requirements

* You need to make a dist file to save your js files.
* You need to get a websocket via alachemy.
* You need to have your own ERC20 address, ABI and your wallet's private key.


