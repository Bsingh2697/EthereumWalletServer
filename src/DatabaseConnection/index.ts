import mongoose from "mongoose"

export class Database {

    async connectToDb() {
        return new Promise((resolve, reject) => {
            try{
                let connStr = `${process.env.DB_URL}${process.env.DB_NAME}`
                mongoose.connect(connStr)
                const conn = mongoose.connection
                conn.on('connected', () => {
                    console.log("Connected")
                    // resolve()
                })
                conn.on('error', ()=>console.log("Error"))
                conn.once('open', () => console.log("Open"))
            }catch(error){
                reject(error)
            } 
        })
    }

}