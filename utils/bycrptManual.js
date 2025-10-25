import bcrypt from "bcrypt";

const password = "Drpassword@9";
bcrypt.hash(password, 10).then(console.log);
