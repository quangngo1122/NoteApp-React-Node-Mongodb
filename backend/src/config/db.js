import express from 'express'
import mongoose from 'mongoose'

export const connectDB = async ()=> {
try{
    await mongoose.connect(
        process.env.MONGOODB_CONNECTION
    )
    console.log("liên kết thành công")
}
catch(error)
{
console.error("lỗi kết nói CSDL:", error)
process.exit(1)
}
}