// //READ JSON FILE
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'))

// //IMPORT DATA INTO DB
// const importData = async () => {
//     try {
//         await Tour.create(tours)
//         console.log("Data successfully loaded")
//     } catch (error) {
//         console.log(error)
//     }
// }
// importData()