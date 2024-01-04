import express, { Request, Response, urlencoded } from "express"
import type { user } from "@prisma/client"
import { prisma } from "./db"
import jwt from "jsonwebtoken"
import { config } from "dotenv"
import bcrypt from "bcrypt"

config()

const app = express()
app.use(express.json())
app.use(urlencoded({ extended: true }))

app.get("/", (req: Request, res: Response) => {
  res.json({ msg: "hi" })
})

app.post("/register", async (req: Request, res: Response) => {
  const { email, name, phone_num, transactions, password }: user = req.body

  const check = await prisma.user.findFirst({ where: { phone_num } })

  if (check) return res.json({ msg: "User already exists" })

  const user = await prisma.user.create({
    data: {
      email,
      phone_num,
      name,
      password: await bcrypt.hash(password, 10),
      // @ts-ignore
      transactions,
    },
  })

  delete (user as { password?: string }).password
  delete (user as { transactions?: string }).transactions

  const token = jwt.sign(user, process.env.SECRET_KEY!, { expiresIn: "2h" })

  res.json(token)
})

app.post("/login", async (req: Request, res: Response) => {
  const { email, password }: user = req.body
  const user = await prisma.user.findFirst({ where: { email } })
  if (!user) return res.json({ msg: "User does not exist" })
  const pwd = await bcrypt.compare(password, user.password)
  if (!pwd) return res.json({ msg: "invalid credentials" })

  delete (user as { password?: string }).password
  delete (user as { transactions?: string }).transactions

  const token = jwt.sign(user, process.env.SECRET_KEY!, { expiresIn: "2h" })
  res.json(token)
})

app.listen(5000, () => console.log("Listening on 5000"))
