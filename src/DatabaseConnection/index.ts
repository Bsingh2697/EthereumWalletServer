import mongoose from "mongoose"

export class Database {

    async connectToDb() {
        return new Promise((resolve, reject) => {
            try{
                let connStr = `mongodb+srv://Bharat:Bharat2697@bharatcluster.6a96d.mongodb.net/Users`
                mongoose.connect(connStr)
                const conn = mongoose.connection
                conn.on('connected', () => {
                    console.log("Connected")
                    resolve("Connected")
                })
                conn.on('error', ()=>console.log("Error"))
                conn.once('open', () => console.log("Open"))
            }catch(error){
                reject(error)
            }
        })
    }

}

// DB_NAME=Users
// DB_URL=mongodb+srv://Bharat:Bharat2697@bharatcluster.6a96d.mongodb.net/