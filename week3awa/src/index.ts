import {Request, Response, Router} from "express"

import { compile } from "morgan"

const router: Router = Router()

router.get("/hello", (req, res) => {
  res.json({ msg: "Hello world!" });
});

router.get("/echo/:id", (req, res) => {
  const id = req.params.id;
  res.json({ msg: id });
});



router.post("/sum", (req, res) => {
  let result = 0
    
  for (let i = 0 ; i < req.body.numbers.length ; i++) {
        result += req.body.numbers[i];
    }
    res.json({ sum: result })

    
});


export default router

