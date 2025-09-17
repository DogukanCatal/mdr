import bcrypt from "bcryptjs";

async function main() {
  const plain = ""; // kendi şifren
  const hash = await bcrypt.hash(plain, 10);
  console.log(hash);
}
main();
