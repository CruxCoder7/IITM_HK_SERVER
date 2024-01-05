import express, { Request, Response, urlencoded } from "express"
import type { user } from "@prisma/client"
import { prisma } from "./db"
import jwt, { JwtPayload } from "jsonwebtoken"
import { config } from "dotenv"
import bcrypt from "bcrypt"
import cors from "cors"
import multer from "multer"
import fs from "fs"
import csv from "csv-parser"
import axios from "axios"

config()

const app = express()
app.use(express.json())
app.use(urlencoded({ extended: true }))
app.use(cors())

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads") // specify the destination folder for file uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname) // generate a unique filename
  },
})

const upload = multer({ storage }).single("file")

app.get("/", (req: Request, res: Response) => {
  res.json({ msg: "hi" })
})

app.post("/register", async (req: Request, res: Response) => {
  const { email, name, phone_num, password }: user = req.body

  const check = await prisma.user.findFirst({ where: { phone_num } })

  if (check) return res.json({ msg: "User already exists" })

  const user = await prisma.user.create({
    data: {
      email,
      phone_num,
      name,
      password: await bcrypt.hash(password, 10),
    },
  })

  delete (user as { password?: string }).password

  const token = jwt.sign(user, process.env.SECRET_KEY!, { expiresIn: "10h" })

  res.json(token)
})

app.post("/login", async (req: Request, res: Response) => {
  const { email, password }: user = req.body
  const user = await prisma.user.findFirst({ where: { email } })
  if (!user) return res.json({ msg: "User does not exist" })
  const pwd = await bcrypt.compare(password, user.password)
  if (!pwd) return res.json({ msg: "invalid credentials" })

  delete (user as { password?: string }).password
  console.log(user)
  const token = jwt.sign(user, process.env.SECRET_KEY!, { expiresIn: "10h" })
  res.json(token)
})

app.post("/verify", async (req: Request, res: Response) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split("Bearer ")[1]
    const check = jwt.verify(token, process.env.SECRET_KEY!)
    if (check) {
      const user = jwt.decode(token)
      return res.json(user)
    }
    return res.json({ msg: "not verified" })
  }
})

app.post("/upload", upload, async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.")
  }

  const token = req.headers.authorization!.split("Bearer ")[1]
  const user = jwt.decode(token)

  const filePath = req.file.path
  const results: any[] = []

  await new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", resolve)
  })

  await prisma.user.update({
    //@ts-ignore
    where: { id: user?.id },
    data: {
      transactions: { data: results },
    },
  })

  const amnt_sum = results.map((data) => parseFloat(data["Amount"]))
  const mean = amnt_sum.reduce((sum, value) => sum + value, 0) / amnt_sum.length

  const data = await axios.post("http://localhost:5555/detect", {
    mean: mean,
  })

  const val = data.data

  await prisma.user.update({
    where: {
      //@ts-ignore
      id: user.id,
    },
    data: {
      high_spender: val == 1 ? true : false,
    },
  })

  return res.json({ msg: "ok" })
})

app.get("/user", async (req, res) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split("Bearer ")[1]
    const user = jwt.decode(token)
    //@ts-ignore
    const result = await prisma.user.findUnique({ where: { id: user?.id } })
    res.json({
      name: result?.name,
      high_spender: result?.high_spender,
    })
  }
})

app.post("/transaction", async (req, res) => {
  console.log(req.body)
  const { time, transId, accNum, amount, category, city } = req.body.formData
  const val = await prisma.user.findFirst({ where: { name: "Bob" } })
  const data = await axios.post("http://localhost:5555/transaction", {
    time,
    transId,
    accNum,
    amount,
    category,
    city,
    user: val,
  })
  res.json({ ok: "sdgdsg" })
})

app.listen(5000, () => console.log("Listening on 5000"))
