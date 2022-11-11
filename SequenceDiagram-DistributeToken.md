# Getting FT holders
<br>

### Functional overview
It manages the FT holder address and balance on the database. 
<br>

### Outline of processing
1. Every time there is a transaction with the desired FT, the contract will emit an event.
2. The backend will notice the event, and gets the sender and reciever addresses and transaction value.
3. backend will store those numbers to the database.

```mermaid
sequenceDiagram

actor user2
actor user1
participant backend
participant database

user1->>user2: send FT
user1->>backend: emit event
Note right of user1: get sender address, reciever address, value 
backend->>database: find sender adderss and subtract value
backend->>database: find reciever address and add value
Note right of backend: if not found, store the address and value

````
### Concerns
* I can also get wallet balance without getting it by calculating the transaction value, but using getbalance() function in the FT contract. I wonder which solution is better.
* Should I look for the duplicate reciever address everytime or look at it all together?
* I have to calculate the estimated number of FT holders and think if the DB can handle it.

<br>
<br>

<br>

# Distributing FT to holders
<br>

### Functional overview
It distributes the FT to holders by following its own rules.
<br>
### Outline of processing
1. TimeScheduler calls the backend function.
1. Backend gets the list of addresses and balances from the dababase.
2. Following its own rule, calculates the reward value for each address.
3. Sends FT from dip wallet to user.

````mermaid
sequenceDiagram
actor user
participant DIP wallet
participant backend
participant database
participant timeScheduler

timeScheduler->>backend: begins the process
backend->>+database: get list of address and balance
database-->>-backend: response(array of address and balance)

backend->> DIP wallet: distributes FTs according to the FT ownership ratio
Note right of DIP wallet: I will list serveal ways to distribute below.
DIP wallet->>user: receive FTs

````

### Examples of rules of distributing FT
* Distribute FT to top 1000 FT holders with some amount.
* Distribute FT to all holders with little amount.
* Get a random holder and send him a lot of FT.

### Concerns
* How are we actually sending FT? Are we using the tranfer() every time? Can we send them at once?
* The gas by sending FT might be too big.
