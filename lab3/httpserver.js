import http from "http"
let port=3000;
const userdata=[
    {id:1,name:"John",email:"jhon@gmail.com"},
    {id:2,name:"Doe",email:"doe@gmail.com"}
     
]
const server=http.createServer((req,resp)=>{
         //resp.write("HEllo World");
         //resp.end();
        const url= req.url;
        const method=req.method;
        if(url==="/msg" && method==="GET"){
             resp.statusCode=200;
             resp.setHeader("Content-type","text/plain" );
             resp.end("Welcome to Backend");
        }
        else if(url==="/userdata" && method==="GET"){
            resp.statusCode=200;
            resp.setHeader("Content-type","application/json" );
            resp.end(JSON.stringify(userdata));
        }
        else if(url==="/create" && method==="POST"){
            let body=""; 
            req.on("data",(chunk)=>{
                body+=chunk.toString();
            });
            req.on("end",()=>{
                const newUser=JSON.parse(body);
                userdata.push(newUser);
                resp.statusCode=201;
                resp.end(JSON.stringify(newUser));
            });
        }
});
server.listen(port,()=>{
    console.log(`Server is running ${port}`);
});





