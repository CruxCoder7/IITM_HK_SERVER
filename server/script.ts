import { prisma } from "./db"
import fs from "fs"
import csv from "csv-parser"

async function script() {
  const filePath = "C:/Users/91755/Downloads/mockData.csv"
  const results: any[] = []

  await new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", resolve)
  })

  const clean = results.map((val) => ({
    amount: val["Amount"],
    category: val["Category"],
    lat: val["Lat"],
    long: val["Long"],
    transaction_id: val["Trans_Id"],
    time: val["Time"],
    unix_time: val["Unix Time"],
    account_num: val["Acc Num"],
    merchant_name: val["Merchant Name"],
    mercant_acc_name: val["Merchant Acc Name"],
  }))

  await prisma.user.create({
    data: {
      email: "bob@gmail.com",
      password: "bob123",
      name: "Bob",
      phone_num: "7550109041",
      transactions: { data: clean },
    },
  })
}

script()
