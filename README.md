# anon-gift
Exchange crypto for gift cards anonymously and instantly!

API ENDPOINTS
/transaction [txn-hash=<hash>]
    Retrieve card

/get_available
    Retrieve available cards
    {
      "amazon": [
        "100"
      ], 
      "visa": [
        "100"
      ]
    }