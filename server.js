const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync('todo.proto', {});
const grpcObj = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObj.todoPackage;

const server = new grpc.Server();
server.addService(todoPackage.Todo.service, {
  "createTodo": createTodo,
  "readTodos": readTodos,
  "readTodosStream": readTodosStream,
});
server.bindAsync('0.0.0.0:40000', grpc.ServerCredentials.createInsecure(), () => {
  server.start();
});

const todos = [];
console.log('running');
function createTodo(call, callback) {
  const data = { ...call.request, id: todos.length + 1 };
  todos.push(data);
  callback(null, data)
}

function readTodos(call, callback) {
  callback(null, { items: todos })
}
function readTodosStream(call, callback) {
  todos.forEach((data) => call.write(data))
  call.end()
}