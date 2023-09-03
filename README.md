Dev process: 

- npm run dev
- npm run proxy (proxy server for webhooks)
- npm run db (proxy db for drizzle studio)
- npm run studio
- change url in clerk path
- change url in clerk webhook

Todo:

- [x] separate new event, edit event, and view event (admin / viewer also)
    - [x] new event
    - [x] edit event
    - [x] view event
    - [x] delete event
- [x] introduce saving event (new / edit)
- [x] introduce saving payment (new / edit)
- [x] introduce changeing payye from list
- [ ] add new payment to event
- [ ] delete payment from event
- [ ] add spinners

Rework:

- [x] use forms instead of "initialstate"
- [ ] submit all froms at once
- [ ] differentiate new / edit forms (call different endpoints)
- [x] simplify evenContext
- [ ] simplify eventListContext
