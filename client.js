const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync('todo.proto', {});
const grpcObj = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObj.todoPackage;

const todoMessage = process.argv[2]

const client = new todoPackage.Todo("localhost:40000", grpc.credentials.createInsecure());

// client.createTodo({
//   id: -1,
//   text: todoMessage || 'any message'
// }, (err, response) => {
//   console.log("from server", JSON.stringify(response));
// })


// client.readTodos({}, (err, response) => {
//   console.log("from server", JSON.stringify(response));
// })

const call = client.readTodosStream();
call.on("data", item => console.log("from server", JSON.stringify(item)));
call.on("end", r => console.log("server done!"));