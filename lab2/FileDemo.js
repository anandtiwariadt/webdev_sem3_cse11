import fs from "node:fs/promises";

const filepath = "UserData.txt";

async function createFile(content) {
    try {
        await fs.writeFile(filepath, content, "utf8");//exemption handling if sucessfully created file or not
        console.log("file created successfully");
    } catch (err) {
        console.log("error in creating file");
    }
}

async function readFile() {
    try {
        const content = await fs.readFile(filepath, "utf8");
        console.log(content);
    } catch (err) {
        console.log("error in reading file");
    }
}

async function deleteFile(){
    try{
        await fs.unlink(filepath);
        console.log("File Deleted Sucessfully");
    }
    catch(error){
        console.log("Error in Deleting File");
    }
}

async function appendFile(content){
    try{
        await fs.appendFile(filepath,content,"utf8");
        console.log("File appended Sucessfully");
    }
    catch(error){
        console.log("error in creating file");
    }

}

await createFile("Hello SIR...");
await readFile();
await deleteFile();
await createFile("Bharat Mata Kii ,");
await appendFile("Jaiiiiii Hooooooooooo...");
await readFile();