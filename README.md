# anon-gift

Exchange crypto for gift cards anonymously and instantly!

### Todos for Cooper

-   Create `connectMetaMask` function in `client/src/pages/Trade.jsx`
-   Create `sendTransaction` function in `client/src/pages/Trade.jsx`
-   Fill in options in `client/src/pages/Trade.jsx` at `cardTypeOptions`, `valueOptions`, and `cryptoTypeOptions`

### Todos for Michael

-   Make help page
-   Responsiveness

### Dev

Server

```bash
# -- install dependencies --
cd server && pip install -r requirements.txt

# -- run flask server --
cd server && python3 api.py
```

Client

```bash
# -- install dependencies --
cd client && yarn
# OR
cd client && npm install

# -- run dev server --
cd client && yarn dev
# OR
cd client && npm run dev

# -- build --
cd client && yarn build
# OR
cd client && npm run build
```

### Stack

-   Flask
-   React
